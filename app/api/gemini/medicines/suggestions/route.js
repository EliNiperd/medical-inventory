import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos

// Helper function: Extract packsize
function extractPacksize(packsize, presentacion, nombre) {
  if (packsize && packsize.trim()) {
    const match = String(packsize).match(/\d+/);
    return match ? match[0] : '1';
  }
  if (presentacion) {
    const presMatch = String(presentacion).match(
      /(\d+)\s*(tabletas?|cápsulas?|comprimidos?|ml|unidades?)/i
    );
    if (presMatch) return presMatch[1];
  }
  if (nombre) {
    const nameMatch = String(nombre).match(/(\d+)\s*(tab|cap|ml|comp)/i);
    if (nameMatch) return nameMatch[1];
  }
  const defaults = {
    jarabe: '120',
    suspension: '60',
    gotas: '15',
    ampolleta: '5',
    vial: '1',
    tableta: '10',
    capsula: '10',
    comprimido: '10',
  };
  if (presentacion) {
    const key = Object.keys(defaults).find((type) => presentacion.toLowerCase().includes(type));
    if (key) return defaults[key];
  }
  return '10';
}

// Helper function: Generate mock price
function generateMockPrice(nombre, principioActivo) {
  const priceRanges = {
    metilfenidato: [150, 400],
    clonazepam: [80, 200],
    amoxicilina: [45, 120],
    azitromicina: [85, 180],
    paracetamol: [15, 50],
    ibuprofeno: [20, 60],
    naproxeno: [25, 75],
    loratadina: [35, 95],
    cetirizina: [40, 85],
    default: [25, 150],
  };
  const key =
    Object.keys(priceRanges).find(
      (drug) => principioActivo.toLowerCase().includes(drug) || nombre.toLowerCase().includes(drug)
    ) || 'default';
  const [min, max] = priceRanges[key];
  const seed = nombre.length + principioActivo.length;
  const price = min + ((seed * 37) % (max - min));
  return Math.round(price * 100) / 100;
}

// Helper function: Try multiple models
async function tryModels(genAI, prompt, modelsToTry) {
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;

      if (response && response.candidates && response.candidates[0].finishReason === 'STOP') {
        const generatedText = response.text();
        if (generatedText) {
          return { text: generatedText, modelUsed: modelName };
        }
      }
    } catch (modelError) {
      console.warn(`Model ${modelName} failed:`, modelError.message);
    }
  }
  return { text: null, modelUsed: null };
}

// Parse response function
function parseResponse(text) {
  try {
    let cleanText = text
      .replace(/```json/gi, '')
      .replace(/```/gi, '')
      .trim();

    let arrayMatch = cleanText.match(/\[[\s\S]*?\]/);

    if (!arrayMatch) {
      console.log('⚠️ No complete JSON array found, trying to repair...');

      if (cleanText.includes('[') && !cleanText.includes(']')) {
        cleanText = cleanText + ']}]';
        arrayMatch = cleanText.match(/\[[\s\S]*?\]/);
      }
    }

    if (!arrayMatch) {
      console.log('❌ Could not extract JSON array');
      return [];
    }

    let jsonStr = arrayMatch[0];
    let parsed;

    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseError) {
      console.log('🔧 JSON parse failed, attempting repair...', parseError);

      jsonStr = jsonStr
        .replace(/,(\s*[}\]])/g, '$1')
        .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
        .replace(/:\s*'([^']*)'/g, ':"$1"')
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/,\s*]/g, ']')
        .replace(/,\s*}/g, '}');

      if (!jsonStr.endsWith(']')) {
        if (jsonStr.includes('{') && !jsonStr.endsWith('}')) {
          jsonStr += '}]';
        } else {
          jsonStr += ']';
        }
      }

      try {
        parsed = JSON.parse(jsonStr);
      } catch (repairError) {
        console.error('❌ Could not repair JSON:', repairError.message);
        return [];
      }
    }

    if (!Array.isArray(parsed)) {
      parsed = [parsed];
    }

    const cleaned = parsed
      .filter((item) => item && typeof item === 'object' && item.nombre)
      .map((med) => ({
        nombre: String(med.nombre || '').trim(),
        principio_activo: String(med.principio_activo || '').trim(),
        presentacion: String(med.presentacion || '').trim(),
        dosis: String(med.dosis || '').trim(),
        packsize: extractPacksize(med.packsize, med.presentacion, med.nombre),
        laboratorio: String(med.laboratorio || '').trim(),
        tipo_receta: String(med.tipo_receta || 'Sin receta').trim(),
        precio_referencia: generateMockPrice(med.nombre, med.principio_activo),
      }))
      .slice(0, 6);

    return cleaned;
  } catch (error) {
    console.error('❌ Parse error:', error.message);
    return [];
  }
}

// Mock data function
function getMockData(query) {
  const mockDB = {
    loratadina: [
      {
        nombre: 'Clarityne',
        principio_activo: 'Loratadina',
        presentacion: 'Tableta',
        dosis: '10mg',
        packsize: '10',
        laboratorio: 'Schering-Plough',
        tipo_receta: 'Sin receta',
        precio_referencia: 89.5,
      },
      {
        nombre: 'Alernit',
        principio_activo: 'Loratadina',
        presentacion: 'Tableta',
        dosis: '10mg',
        packsize: '10',
        laboratorio: 'Genomma Lab',
        tipo_receta: 'Sin receta',
        precio_referencia: 45.0,
      },
    ],
    paracetamol: [
      {
        nombre: 'Tylenol',
        principio_activo: 'Paracetamol',
        presentacion: 'Tableta',
        dosis: '500mg',
        packsize: '20',
        laboratorio: 'Johnson & Johnson',
        tipo_receta: 'Sin receta',
        precio_referencia: 25.5,
      },
      {
        nombre: 'Tempra',
        principio_activo: 'Paracetamol',
        presentacion: 'Jarabe',
        dosis: '160mg/5ml',
        packsize: '120',
        laboratorio: 'Bristol Myers',
        tipo_receta: 'Sin receta',
        precio_referencia: 35.0,
      },
      {
        nombre: 'Mejoral',
        principio_activo: 'Paracetamol',
        presentacion: 'Tableta',
        dosis: '500mg',
        packsize: '12',
        laboratorio: 'Bayer',
        tipo_receta: 'Sin receta',
        precio_referencia: 18.9,
      },
    ],
    topiramato: [
      {
        nombre: 'Topamax',
        principio_activo: 'Topiramato',
        presentacion: 'Tableta',
        dosis: '25mg',
        packsize: '30',
        laboratorio: 'Janssen',
        tipo_receta: 'Con receta',
        precio_referencia: 245.0,
      },
      {
        nombre: 'Epitomax',
        principio_activo: 'Topiramato',
        presentacion: 'Cápsula',
        dosis: '15mg',
        packsize: '28',
        laboratorio: 'Janssen',
        tipo_receta: 'Con receta',
        precio_referencia: 189.5,
      },
    ],
    metilfenidato: [
      {
        nombre: 'Ritalin',
        principio_activo: 'Metilfenidato',
        presentacion: 'Tableta',
        dosis: '10mg',
        packsize: '30',
        laboratorio: 'Novartis',
        tipo_receta: 'Controlado',
        precio_referencia: 180.0,
      },
      {
        nombre: 'Concerta',
        principio_activo: 'Metilfenidato',
        presentacion: 'Tableta liberación prolongada',
        dosis: '18mg',
        packsize: '30',
        laboratorio: 'Janssen',
        tipo_receta: 'Controlado',
        precio_referencia: 320.0,
      },
    ],
    ibuprofeno: [
      {
        nombre: 'Advil',
        principio_activo: 'Ibuprofeno',
        presentacion: 'Cápsula',
        dosis: '400mg',
        packsize: '20',
        laboratorio: 'Pfizer',
        tipo_receta: 'Sin receta',
        precio_referencia: 45.0,
      },
    ],
  };

  for (const [key, meds] of Object.entries(mockDB)) {
    if (query.includes(key) || key.includes(query)) {
      return meds;
    }
  }

  return [];
}

// Main GET handler
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    // Validación básica
    if (!query || query.length < 3) {
      return NextResponse.json({ suggestions: [] });
    }

    const cleanQuery = query.trim().toLowerCase();

    // Verificar cache
    const cacheKey = `med_${cleanQuery}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        suggestions: cached.data,
        cached: true,
      });
    }

    // Verificar API key
    if (!process.env.GOOGLE_API_KEY) {
      console.error('❌ Google API key not found');
      return NextResponse.json({
        suggestions: getMockData(cleanQuery),
        source: 'mock',
      });
    }

    const modelsToTry = [
      'gemini-2.0-flash-exp',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
    ];

    // Step 1: Extract entities
    const extractionPrompt = `
As a pharmacist assistant, analyze the user's search query and extract key medical entities.
Query: "${cleanQuery}"
Extract the following into a valid JSON object:
- "active_ingredient": The main active chemical compound.
- "brand_name": The commercial or brand name.
- "dosage": The strength of the medicine (e.g., "500mg").
- "form": The pharmaceutical form (e.g., "tablets", "syrup").
If a value is not present, set it to null.
Return ONLY valid JSON, no additional text.
JSON Output:
    `.trim();

    const { text: extractedText, modelUsed: extractModelUsed } = await tryModels(
      genAI,
      extractionPrompt,
      modelsToTry
    );

    let optimizedQuery = cleanQuery;
    let extractedEntities = {};

    if (extractedText) {
      try {
        const cleanedJson = extractedText
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();
        extractedEntities = JSON.parse(cleanedJson);
        optimizedQuery = [
          extractedEntities.brand_name,
          extractedEntities.active_ingredient,
          extractedEntities.dosage,
          extractedEntities.form,
        ]
          .filter(Boolean)
          .join(' ');
      } catch (e) {
        console.error('Could not parse entities, using original query:', e.message);
      }
    }

    if (!optimizedQuery.trim()) {
      optimizedQuery = cleanQuery;
    }

    // Step 2: Search and analyze (simulated web search with Gemini)
    const searchPrompt = `
As a medical information specialist for Mexican pharmaceuticals, provide detailed information about: "${optimizedQuery}"

Return a JSON array with the most relevant medicine(s) available in Mexico. Maximum 3 results.
Each medicine should have:
- "nombre": Commercial/brand name
- "principio_activo": Active ingredient(s)
- "presentacion": Form (Tableta/Cápsula/Jarabe/etc)
- "dosis": Dosage strength (e.g., "500mg")
- "packsize": Number of units per package
- "laboratorio": Manufacturer/laboratory
- "tipo_receta": "Sin receta", "Con receta", or "Controlado"

Return ONLY valid JSON array, no additional text.
Format: [{"nombre": "...", "principio_activo": "...", ...}]
    `.trim();

    const { text: evaluatedText, modelUsed } = await tryModels(genAI, searchPrompt, modelsToTry);

    if (!evaluatedText || evaluatedText.length === 0) {
      const mockData = getMockData(cleanQuery);
      return NextResponse.json({
        suggestions: mockData,
        source: 'mock-no-response',
        debug: {
          apiKeyExists: !!process.env.GOOGLE_API_KEY,
          modelsAttempted: modelsToTry.length,
        },
      });
    }

    const suggestions = parseResponse(evaluatedText);

    // Guardar en cache
    cache.set(cacheKey, {
      data: suggestions,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      suggestions,
      source: 'gemini-ai',
      count: suggestions.length,
      modelUsed: modelUsed || extractModelUsed,
    });
  } catch (error) {
    //console.error('❌ API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
        suggestions: [],
      },
      { status: 500 }
    );
  }
}
