'use client';

import { useState } from 'react';
import {
  PlusIcon,
  DocumentIcon,
  ClockIcon,
  CpuChipIcon,
  CircleStackIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import Tesseract from 'tesseract.js';

export default function ResponsiveOCRUploader() {
  const [text, setText] = useState('');
  const [durationMs, setDurationMs] = useState(0);
  const [cpuUsage, setCpu] = useState([]);
  const [memory, setMemory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecciona solo archivos de imagen');
      return;
    }

    // Validar tamaño (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError('');
    setText('');

    // 1️⃣ Procesa la imagen con Tesseract.js desde el cliente (navegador) en lugar de enviarla al servidor
    /*
    try {
      // 2️⃣ En lugar de enviar la imagen al servidor, procesa el archivo directamente
      const {
        data: { text: detectedText },
      } = await Tesseract.recognize(file, 'spa+eng', {
        tessedit_pageseg_mode: Tesseract.SPARSE_TEXT,
        logger: (m) => console.log(m), // Opcional: ver el progreso en la consola
      });

      // 3️⃣ Asigna el texto detectado al estado del componente
      setText(detectedText);
    } catch (err) {
      console.error('Error al procesar la imagen con Tesseract.js:', err);
      setError('No se pudo procesar la imagen. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
*/

    // 4️⃣ Enviar la imagen al servidor
    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error en el servidor');
      }

      const data = await response.json();
      setText(data.text || 'No se detectó texto en la imagen');
      setDurationMs(data.durationMs || 0);
      setCpu(data.cpu || []);
      setMemory(data.memory || []);
    } catch (error) {
      console.error('OCR Error:', error);
      setError('Error al procesar la imagen. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const resetUploader = () => {
    setText('');
    setError('');
    setDurationMs(0);
    setCpu([]);
    setMemory([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          OCR - Reconocimiento de Texto
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Sube una imagen y extrae el texto automáticamente
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zona de carga */}
        <div className="space-y-4">
          {/* Upload Area - Responsivo */}
          <label
            htmlFor="file-upload"
            className="block cursor-pointer group"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {/* Desktop/Tablet Upload Area */}
            <div
              className={`
              hidden sm:flex flex-col items-center justify-center 
              min-h-[200px] lg:min-h-[300px] p-8
              border-2 border-dashed rounded-lg transition-all duration-200
              ${
                dragOver
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : loading
                    ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20'
                    : error
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                      : text
                        ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 bg-gray-50 dark:bg-gray-800 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }
            `}
            >
              <div className="text-center">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <svg
                      className="animate-spin h-8 w-8 text-yellow-500 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <p className="text-yellow-700 dark:text-yellow-300 font-medium">
                      Procesando imagen...
                    </p>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                      Extrayendo texto con OCR
                    </p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center">
                    <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mb-3" />
                    <p className="text-red-700 dark:text-red-300 font-medium">Error</p>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
                  </div>
                ) : text ? (
                  <div className="flex flex-col items-center">
                    <CheckCircleIcon className="h-8 w-8 text-green-500 mb-3" />
                    <p className="text-green-700 dark:text-green-300 font-medium">
                      Texto extraído exitosamente
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Haz clic para procesar otra imagen
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <PlusIcon className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mb-3 transition-colors" />
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      Arrastra tu imagen aquí
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      PNG, JPG, GIF (máx. 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Upload Area */}
            <div
              className={`
              sm:hidden flex flex-col items-center justify-center 
              h-32 p-4 border-2 border-dashed rounded-lg transition-all
              ${
                loading
                  ? 'border-yellow-300 bg-yellow-50'
                  : error
                    ? 'border-red-300 bg-red-50'
                    : text
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 bg-gray-50 active:bg-blue-50'
              }
            `}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 text-yellow-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="text-yellow-700 text-sm">Procesando...</span>
                </div>
              ) : (
                <div className="text-center">
                  <PlusIcon className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Seleccionar imagen</p>
                </div>
              )}
            </div>
          </label>

          <input
            id="file-upload"
            type="file"
            onChange={handleInputChange}
            className="hidden"
            accept="image/*"
            disabled={loading}
          />

          {/* Botón de reset */}
          {(text || error) && (
            <button
              onClick={resetUploader}
              className="w-full sm:w-auto px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
            >
              Procesar nueva imagen
            </button>
          )}
        </div>

        {/* Resultados */}
        <div className="space-y-4">
          {/* Texto extraído */}
          {text && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <DocumentIcon className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Texto Detectado
                </h3>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-3 max-h-40 sm:max-h-60 overflow-y-auto">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {text}
                </p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(text)}
                className="mt-3 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                📋 Copiar texto
              </button>
            </div>
          )}

          {/* Estadísticas de rendimiento */}
          {(durationMs > 0 || cpuUsage.length > 0) && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Estadísticas de Procesamiento
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {durationMs > 0 && (
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-green-500 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Duración</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {durationMs}ms
                      </p>
                    </div>
                  </div>
                )}

                {cpuUsage.length > 0 && (
                  <div className="flex items-center">
                    <CpuChipIcon className="h-4 w-4 text-blue-500 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">CPU</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {cpuUsage[0]?.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )}

                {memory.length > 0 && (
                  <div className="flex items-center">
                    <CircleStackIcon className="h-4 w-4 text-purple-500 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Memoria</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {(memory[0] / 1024 / 1024).toFixed(1)}MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error al procesar
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips de uso - Solo desktop */}
      <div className="hidden lg:block mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          💡 Consejos para mejores resultados
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Usa imágenes con texto claro y bien iluminado</li>
          <li>• Evita imágenes borrosas o con texto muy pequeño</li>
          <li>• Los formatos PNG y JPG funcionan mejor</li>
        </ul>
      </div>
    </div>
  );
}
