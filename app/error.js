'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Opcional: Registrar el error en un servicio de monitoreo
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500">Algo salió mal</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Lo sentimos, hemos encontrado un problema inesperado.
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {error.message || 'Error en el servidor.'}
        </p>
        <Button
          onClick={
            // Intenta recuperarte volviendo a renderizar el segmento
            () => reset()
          }
          className="mt-6"
        >
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
}
