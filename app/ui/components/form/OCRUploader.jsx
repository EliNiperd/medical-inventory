'use client';

import { useState, useRef } from 'react';
import {
  CameraIcon,
  ArrowUpOnSquareIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center p-2 border border-transparent rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700 rounded-full',
        discreet:
          'bg-transparent text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700',
        error: 'bg-red-600 text-white hover:bg-red-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export default function OCRUploader({
  onUploadStart,
  onSuccess,
  onError,
  className,
  children,
  variant = 'default',
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      const err = 'Por favor, selecciona solo archivos de imagen';
      setError(err);
      onError?.(err);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const err = 'El archivo es demasiado grande. Máximo 5MB';
      setError(err);
      onError?.(err);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError('');
    onUploadStart?.();

    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en el servidor');
      }

      const data = await response.json();
      onSuccess?.(data);
    } catch (err) {
      console.error('OCR Error:', err);
      const errorMessage = err.message || 'Error al procesar la imagen.';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={cn(buttonVariants({ variant: error ? 'error' : variant }), className)}
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : children ? (
          children
        ) : error ? (
          <ExclamationTriangleIcon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <CameraIcon className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
      <input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        onChange={handleInputChange}
        className="hidden"
        accept="image/*"
        disabled={loading}
      />
    </>
  );
}
