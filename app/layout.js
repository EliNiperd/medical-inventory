import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { ToasterProvider } from '@/components/providers/ToasterProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Medical Inventory',
  description: 'Sistema de gestión de inventario de medicamentos',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', type: 'image/png' }, // Then .png
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main>{children}</main>
            <Toaster />
            <ToasterProvider />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
