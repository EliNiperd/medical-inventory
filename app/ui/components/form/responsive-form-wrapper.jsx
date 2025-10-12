export default function ResponsiveFormWrapper({
  children,
  title,
  subtitle,
  maxWidth = '4xl', // sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl
}) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
  };

  return (
    <div className="min-h-full">
      <div className={`mx-auto ${maxWidthClasses[maxWidth]}  px-4 sm:px-6 lg:px-8`}>
        {/* Header */}
        {(title || subtitle) && (
          <div className="mb-2 sm:mb-4 ">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{subtitle}</p>
            )}
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

// Hook para detectar tamaño de pantalla
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState('lg');

  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < 640) setScreenSize('sm');
      else if (window.innerWidth < 768) setScreenSize('md');
      else if (window.innerWidth < 1024) setScreenSize('lg');
      else if (window.innerWidth < 1280) setScreenSize('xl');
      else setScreenSize('2xl');
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return screenSize;
}

import { cn } from '@/lib/utils';

// Componente para grids responsivos - CORRECCIÓN DEFINITIVA PARA TAILWIND JIT
export function ResponsiveGrid({ children, cols = { sm: 1, md: 2 } }) {
  const classMap = {
    sm: {
      1: 'sm:grid-cols-1',
      2: 'sm:grid-cols-2',
      3: 'sm:grid-cols-3',
      4: 'sm:grid-cols-4',
    },
    md: {
      1: 'md:grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'md:grid-cols-4',
    },
    lg: {
      1: 'lg:grid-cols-1',
      2: 'lg:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
    },
    xl: {
      1: 'xl:grid-cols-1',
      2: 'xl:grid-cols-2',
      3: 'xl:grid-cols-3',
      4: 'xl:grid-cols-4',
    },
  };

  const className = cn(
    'grid grid-cols-1 gap-4 sm:gap-6', // Base y default para móvil
    cols.sm && classMap.sm[cols.sm],
    cols.md && classMap.md[cols.md],
    cols.lg && classMap.lg[cols.lg],
    cols.xl && classMap.xl[cols.xl]
  );

  return <div className={className}>{children}</div>;
}

// Componente para campos de formulario responsivos - CORRECCIÓN DEFINITIVA PARA TAILWIND JIT
export function ResponsiveField({ children, span = { sm: 1, md: 1 } }) {
  const classMap = {
    sm: {
      1: 'sm:col-span-1',
      2: 'sm:col-span-2',
      3: 'sm:col-span-3',
      4: 'sm:col-span-4',
      full: 'sm:col-span-full',
    },
    md: {
      1: 'md:col-span-1',
      2: 'md:col-span-2',
      3: 'md:col-span-3',
      4: 'md:col-span-4',
      full: 'md:col-span-full',
    },
    lg: {
      1: 'lg:col-span-1',
      2: 'lg:col-span-2',
      3: 'lg:col-span-3',
      4: 'lg:col-span-4',
      full: 'lg:col-span-full',
    },
  };

  const className = cn(
    span.sm === 'full' ? 'col-span-full' : `col-span-${span.sm || 1}`,
    span.sm && classMap.sm[span.sm],
    span.md && classMap.md[span.md],
    span.lg && classMap.lg[span.lg]
  );

  return <div className={className}>{children}</div>;
}
