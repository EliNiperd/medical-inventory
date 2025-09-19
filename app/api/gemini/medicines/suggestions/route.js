// app/api/medicines/suggestions/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

// Extraer información de packsize de diferentes fuentes
function extractPacksize(packsize, presentacion, nombre) {
  // Si ya viene el packsize de Gemini
  if (packsize && packsize.trim()) {
    const match = String(packsize).match(/\d+/);
    return match ? match[0] : '1';
  }
  
  // Buscar en la presentación
  if (presentacion) {
    const presMatch = String(presentacion).match(/(\d+)\s*(tabletas?|cápsulas?|comprimidos?|ml|unidades?)/i);
    if (presMatch) {
      return presMatch[1];
    }
  }
  
  // Buscar en el nombre
  if (nombre) {
    const nameMatch = String(nombre).match(/(\d+)\s*(tab|cap|ml|comp)/i);
    if (nameMatch) {
      return nameMatch[1];
    }
  }
  
  // Defaults basados en presentación
  const defaults = {
    'jarabe': '120',
    'suspension': '60', 
    'gotas': '15',
    'ampolleta': '5',
    'vial': '1',
    'tableta': '10',
    'capsula': '10',
    'comprimido': '10'
  };
  
  if (presentacion) {
    const key = Object.keys(defaults).find(type => 
      presentacion.toLowerCase().includes(type)
    );
    if (key) return defaults[key];
  }
  
  return '10'; // Default genérico
}

// Generar precios mock realistas basados en el tipo de medicamento
function generateMockPrice(nombre, principioActivo) {
  const priceRanges = {
    // Medicamentos controlados - más caros
    'metilfenidato': [150, 400],
    'topiramato': [180, 350], 
    'clonazepam': [80, 200],
    
    // Antibióticos - precio medio
    'amoxicilina': [45, 120],
    'azitromicina': [85, 180],
    
    // Analgésicos comunes - baratos
    'paracetamol': [15, 50],
    'ibuprofeno': [20, 60],
    'naproxeno': [25, 75],
    
    // Antihistamínicos
    'loratadina': [35, 95],
    'cetirizina': [40, 85],
    
    // Default para medicamentos desconocidos
    'default': [25, 150]
  };
  
  // Buscar por principio activo
  const key = Object.keys(priceRanges).find(drug => 
    principioActivo.toLowerCase().includes(drug) ||
    nombre.toLowerCase().includes(drug)
  ) || 'default';
  
  const [min, max] = priceRanges[key];
  
  // Generar precio aleatorio en el rango, pero consistente para el mismo medicamento
  const seed = nombre.length + principioActivo.length;
  const price = min + ((seed * 37) % (max - min));
  
  return Math.round(price * 100) / 100; // Redondear a 2 decimales
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Simple cache
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos

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
        cached: true 
      });
    }
    
    // Verificar API key
    if (!process.env.GOOGLE_API_KEY) {
      console.error('❌ Google API key not found');
      return NextResponse.json({ 
        suggestions: getMockData(cleanQuery),
        source: 'mock' 
      });
    }
    
    //console.log('🔍 Searching for:', cleanQuery);
    
    try {
      //console.log('🔑 API Key length:', process.env.GOOGLE_API_KEY?.length);
      //console.log('🔑 API Key starts with:', process.env.GOOGLE_API_KEY?.substring(0, 10));
      
      // Probar diferentes modelos
      const modelsToTry = [
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro-latest", 
        "gemini-2.0-flash-exp",
        "gemini-1.5-flash",
        "gemini-1.5-pro"
      ];
      
      let text = '';
      let modelUsed = '';
      
      for (const modelName of modelsToTry) {
        try {
          //console.log(`🤖 Trying model: ${modelName}`);
          
          const model = genAI.getGenerativeModel({ 
            model: modelName,
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1000,
            }
          });
          
          // Prompt SIN precios para evitar filtros de seguridad + info de empaque
          const prompt = `List Mexican commercial medicine brands containing "${cleanQuery}".
                Return COMPLETE JSON array (ensure valid JSON):
                [
                {
                    "nombre": "Brand name",
                    "principio_activo": "Active ingredient", 
                    "presentacion": "Tablet/Capsule/Syrup",
                    "dosis": "mg dose",
                    "packsize": "units per box",
                    "laboratorio": "Manufacturer"
                }
                ]

                IMPORTANT: Return complete valid JSON array only. Maximum 10 medicines.`;
          
          //console.log('📤 Sending enhanced prompt with packsize');
          
          const result = await model.generateContent(prompt);
          
          // Verificar candidatos y safety ratings
          const candidates = result.response?.candidates;
          //console.log('📊 Candidates received:', candidates?.length || 0);
          
          if (candidates && candidates.length > 0) {
            const candidate = candidates[0];
            //console.log('🏁 Finish reason:', candidate.finishReason);
            //console.log('🛡️ Safety ratings:', candidate.safetyRatings?.map(r => `${r.category}: ${r.probability}`));
            
            // Verificar si fue bloqueado por seguridad
            if (candidate.finishReason === 'SAFETY') {
              console.log('⚠️ Content blocked by safety filters');
              continue; // Probar siguiente modelo
            }
          }
          
          text = result.response.text();
          modelUsed = modelName;
          
          if (text && text.length > 0) {
            console.log(`✅ Success with ${modelName}, response length: ${text.length}`);
            break;
          }
          
        } catch (modelError) {
          console.error(`❌ Model ${modelName} failed:`, modelError.message);
          continue;
        }
      }
      
      //console.log('📝 Final response length:', text.length);
      //console.log('🤖 Model used:', modelUsed);
      //console.log('📄 Response preview:', text.substring(0, 200));
      
      if (!text || text.length === 0) {
        console.log('⚠️ All models returned empty, using mock data');
        const mockData = getMockData(cleanQuery);
        return NextResponse.json({ 
          suggestions: mockData, 
          source: 'mock-no-response',
          debug: {
            apiKeyExists: !!process.env.GOOGLE_API_KEY,
            apiKeyLength: process.env.GOOGLE_API_KEY?.length,
            modelsAttempted: modelsToTry.length
          }
        });
      }
      
      // Parse JSON simple
      const suggestions = parseResponse(text);
      
      // Guardar en cache
      cache.set(cacheKey, {
        data: suggestions,
        timestamp: Date.now()
      });
      
      return NextResponse.json({ 
        suggestions, 
        source: 'gemini',
        count: suggestions.length 
      });
      
    } catch (geminiError) {
      console.error('❌ Gemini API error:', geminiError.message);
      
      // Fallback a mock data
      const mockData = getMockData(cleanQuery);
      return NextResponse.json({ 
        suggestions: mockData,
        source: 'mock-fallback',
        error: 'AI service temporarily unavailable'
      });
    }
    
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Parser simple y robusto
function parseResponse(text) {
  try {
    //console.log('🔄 Parsing response...');
    //console.log('📄 Full response:', text); // Ver respuesta completa
    
    // Limpiar texto
    let cleanText = text
      .replace(/```json/gi, '')
      .replace(/```/gi, '')
      .trim();
    
    // Buscar array JSON
    let arrayMatch = cleanText.match(/\[[\s\S]*?\]/);
    
    if (!arrayMatch) {
      console.log('⚠️ No complete JSON array found, trying to repair...');
      
      // Intentar reparar JSON incompleto
      if (cleanText.includes('[') && !cleanText.includes(']')) {
        console.log('🔧 Attempting to close incomplete array');
        cleanText = cleanText + ']}]';
        arrayMatch = cleanText.match(/\[[\s\S]*?\]/);
      }
    }
    
    if (!arrayMatch) {
      console.log('❌ Could not extract JSON array');
      return [];
    }
    
    let jsonStr = arrayMatch[0];
    //console.log('📋 Extracted JSON:', jsonStr);
    
    // Intentar parsear
    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseError) {
      console.log('🔧 JSON parse failed, attempting repair...');
      
      // Reparaciones comunes
      jsonStr = jsonStr
        .replace(/,(\s*[}\]])/g, '$1') // Remover comas finales
        .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Agregar comillas a keys
        .replace(/:\s*'([^']*)'/g, ':"$1"') // Cambiar comillas simples
        .replace(/\n/g, ' ') // Remover saltos de línea
        .replace(/\s+/g, ' ') // Normalizar espacios
        .replace(/,\s*]/g, ']') // Limpiar comas antes de cierre
        .replace(/,\s*}/g, '}'); // Limpiar comas antes de cierre de objeto
      
      // Si el array parece incompleto, intentar cerrarlo
      if (!jsonStr.endsWith(']')) {
        if (jsonStr.includes('{') && !jsonStr.endsWith('}')) {
          jsonStr += '}]';
        } else {
          jsonStr += ']';
        }
      }
      
      //console.log('🔧 Repaired JSON:', jsonStr);
      
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
    
    // Limpiar y validar datos
    const cleaned = parsed
      .filter(item => item && typeof item === 'object' && item.nombre)
      .map(med => ({
        nombre: String(med.nombre || '').trim(),
        principio_activo: String(med.principio_activo || '').trim(),
        presentacion: String(med.presentacion || '').trim(),
        dosis: String(med.dosis || '').trim(),
        packsize: extractPacksize(med.packsize, med.presentacion, med.nombre),
        laboratorio: String(med.laboratorio || '').trim(),
        tipo_receta: String(med.tipo_receta || 'Sin receta').trim(),
        // Agregar precio mock basado en el tipo de medicamento
        precio_referencia: generateMockPrice(med.nombre, med.principio_activo)
      }))
      .slice(0, 6); // Máximo 6 resultados
    
    //console.log('✅ Parsed', cleaned.length, 'medicines successfully');
    return cleaned;
    
  } catch (error) {
    console.error('❌ Parse error:', error.message);
    return [];
  }
}

// Datos mock para testing y fallback
function getMockData(query) {
  const mockDB = {
    'loratadina': [
      {
        nombre: "Clarityne",
        principio_activo: "Loratadina",
        presentacion: "Tableta",
        dosis: "10mg",
        cantidad: "10 tabletas",
        laboratorio: "Schering-Plough",
        tipo_receta: "Sin receta",
        precio_referencia: 89.50
      },
      {
        nombre: "Alernit",
        principio_activo: "Loratadina", 
        presentacion: "Tableta",
        dosis: "10mg",
        cantidad: "10 tabletas",
        laboratorio: "Genomma Lab",
        tipo_receta: "Sin receta",
        precio_referencia: 45.00
      }
    ],
    'paracetamol': [
      {
        nombre: "Tylenol",
        principio_activo: "Paracetamol",
        presentacion: "Tableta", 
        dosis: "500mg",
        packsize: "20",
        laboratorio: "Johnson & Johnson",
        tipo_receta: "Sin receta",
        precio_referencia: 25.50
      },
      {
        nombre: "Tempra",
        principio_activo: "Paracetamol",
        presentacion: "Jarabe",
        dosis: "160mg/5ml", 
        packsize: "120",
        laboratorio: "Bristol Myers",
        tipo_receta: "Sin receta",
        precio_referencia: 35.00
      },
      {
        nombre: "Mejoral",
        principio_activo: "Paracetamol",
        presentacion: "Tableta",
        dosis: "500mg",
        packsize: "12",
        laboratorio: "Bayer",
        tipo_receta: "Sin receta",
        precio_referencia: 18.90
      }
    ],
    'topiramato': [
      {
        nombre: "Topamax",
        principio_activo: "Topiramato",
        presentacion: "Tableta",
        dosis: "25mg",
        packsize: "30",
        laboratorio: "Janssen",
        tipo_receta: "Con receta",
        precio_referencia: 245.00
      },
      {
        nombre: "Epitomax",
        principio_activo: "Topiramato",
        presentacion: "Cápsula",
        dosis: "15mg",
        packsize: "28",
        laboratorio: "Janssen",
        tipo_receta: "Con receta",
        precio_referencia: 189.50
      }
    ],
    'metilfenidato': [
      {
        nombre: "Ritalin",
        principio_activo: "Metilfenidato",
        presentacion: "Tableta",
        dosis: "10mg",
        packsize: "30",
        laboratorio: "Novartis",
        tipo_receta: "Controlado",
        precio_referencia: 180.00
      },
      {
        nombre: "Concerta",
        principio_activo: "Metilfenidato",
        presentacion: "Tableta liberación prolongada",
        dosis: "18mg",
        packsize: "30",
        laboratorio: "Janssen",
        tipo_receta: "Controlado", 
        precio_referencia: 320.00
      }
    ],
    'ibuprofeno': [
      {
        nombre: "Advil",
        principio_activo: "Ibuprofeno",
        presentacion: "Cápsula",
        dosis: "400mg",
        cantidad: "20 cápsulas",
        laboratorio: "Pfizer",
        tipo_receta: "Sin receta",
        precio_referencia: 45.00
      }
    ]
  };
  
  // Buscar coincidencias
  for (const [key, meds] of Object.entries(mockDB)) {
    if (query.includes(key) || key.includes(query)) {
      return meds;
    }
  }
  
  return [];
}
/*
export async function fetchSuggestData(query) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Actúa como un asistente de inventario de medicamentos. 
            Para el término de búsqueda como clave COFEPRIS "${query}", 
            proporciona un listado de medicamentos reales en méxico que contengan esa palabra. 
            Para cada medicamento, nombre, principio_activo, presentacion, dosis, cantidad, via_administracion, laboratorio, registro_sanitario, tipo_receta, precio_referencia. 
            Responde únicamente con un array de objetos JSON que sigan el siguiente formato: 
            [{"nombre": "...", "principio_activo": "...", "presentacion": "...", "dosis": "...", "cantidad": "..."}]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text();

        // 1. Usa una expresión regular para encontrar el primer y último corchete
        const match = rawText.match(/\[.*\]/s);

        if (!match) {
            console.error("No se encontró una estructura de array JSON en la respuesta.");
            return [];
        }

        // 2. Extrae el texto que coincide con la expresión regular
        const jsonStringFirst = match[0];

        if (query.length >= 5)
            console.log("Raw response from Gemini:", jsonStringFirst, 100);

        // 1. Find the starting and ending brackets of the JSON content
        const firstBracket = jsonStringFirst.indexOf('[');
        const lastBracket = jsonStringFirst.lastIndexOf(']');

        if (firstBracket === -1 || lastBracket === -1) {
            // If no JSON array is found, return an empty array or handle as an error
            console.error("No valid JSON array found in Gemini's response.");
            return [];
        }

        // 2. Extract the substring containing only the JSON array
        //const jsonString = rawText.substring(firstBracket, lastBracket + 1);

        // 3. Parse the clean JSON string
        const suggestions = JSON.parse(jsonStringFirst);

        return suggestions;
    } catch (error) {
        console.error("Error fetching suggest data:", error);
        return [];
    }

}*/