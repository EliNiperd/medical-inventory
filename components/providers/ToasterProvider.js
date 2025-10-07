// components/providers/ToasterProvider.js
'use client';

import { Toaster } from 'sonner';

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      expand={true}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          padding: '1rem',
        },
        className: 'sonner-toast',
        descriptionClassName: 'sonner-description',
        actionButtonStyle: {
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '0.375rem',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          fontWeight: '500',
        },
        cancelButtonStyle: {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          borderRadius: '0.375rem',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          fontWeight: '500',
        },
      }}
    />
  );
}

// app/layout.js - Agregar este provider al layout principal
/*
import { ToasterProvider } from '@/components/providers/ToasterProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
*/
