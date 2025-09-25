import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'medical-inventory',
  description: 'A simple medical inventory management system',
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
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
