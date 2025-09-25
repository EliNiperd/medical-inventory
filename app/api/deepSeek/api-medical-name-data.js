'use server';

import axios from 'axios';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';

// Añade este console.log para debugging
console.log('API Key loaded:', DEEPSEEK_API_KEY ? 'Yes' : 'No');

const deepseekClient = axios.create({
  baseURL: DEEPSEEK_BASE_URL,
  headers: {
    Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export async function fetchSuggestData(nameMedical) {
  try {
    const prompt = `Actúa como un asistente de inventario de medicamentos. 
            Para el término de búsqueda "${nameMedical}", 
            proporciona un listado de medicamentos reales en méxico que contengan esa palabra. 
            Para cada medicamento, dame el nombre comercial, 
            el principio activo, la presentación (por ejemplo, "Tableta", "Jarabe"), 
            la dosis (por ejemplo, "10 mg") y la cantidad del empaque (por ejemplo, "Caja con 30"). 
            Responde únicamente con un array de objetos JSON que sigan el siguiente formato: 
            [{"nombre": "...", "principio_activo": "...", "presentacion": "...", "dosis": "...", "cantidad": "..."}]`;

    const response = await deepseekClient.post('/chat/completions', {
      // Añadido endpoint específico
      model: 'deepseek-chat', // Especificar el modelo
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
    });
    return response.data;
  } catch (error) {
    console.error('Error searching with DeepSeek:', error);
    return [];
  }
}
