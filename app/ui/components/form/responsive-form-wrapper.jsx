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

// Componente para grids responsivos
export function ResponsiveGrid({ children, cols = { sm: 1, md: 2, lg: 3, xl: 4 } }) {
  return (
    <div
      className={`
      grid gap-4 sm:gap-6
      grid-cols-${cols.sm} 
      sm:grid-cols-${cols.sm} 
      md:grid-cols-${cols.md} 
      lg:grid-cols-${cols.lg} 
      xl:grid-cols-${cols.xl}
    `}
    >
      {children}
    </div>
  );
}

// Componente para campos de formulario responsivos
export function ResponsiveField({ children, span = { sm: 1, md: 1, lg: 1 } }) {
  return (
    <div
      className={`
      col-span-${span.sm}
      sm:col-span-${span.sm}
      md:col-span-${span.md}
      lg:col-span-${span.lg}
    `}
    >
      {children}
    </div>
  );
}
