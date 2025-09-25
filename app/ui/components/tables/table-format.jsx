import { CalendarIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import { useMemo } from 'react';

export function RowTable({ value, row, type = 'default', icon = null }) {
  const LinkIcon = icon;
  if (type === 'default') {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
      </div>
    );
  } else if (type === 'date') {
    return (
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {value ? new Date(value).toLocaleDateString('es-MX') : 'N/D'}
        </span>
      </div>
    );
  } else if (type === 'withIcon') {
    return (
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
          <LinkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
      </div>
    );
  }
}

export function useTableProcessing(data, { searchQuery, sortBy, sortOrder }) {
  return useMemo(() => {
    let filtered = data || [];

    // Aplicar búsqueda
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Aplicar ordenamiento
    if (sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[sortBy] || '';
        const bVal = b[sortBy] || '';

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }

        return sortOrder === 'asc'
          ? aVal < bVal
            ? -1
            : aVal > bVal
              ? 1
              : 0
          : aVal > bVal
            ? -1
            : aVal < bVal
              ? 1
              : 0;
      });
    }

    return filtered;
  }, [data, searchQuery, sortBy, sortOrder]);
}

export function EmptyState({ searchQuery, onClearSearch, icon = null, tableName = '' }) {
  return (
    <div className="text-center py-12">
      {icon && <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">{icon}</div>}
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
        {searchQuery ? 'Sin resultados' : `No hay ${tableName}`}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {searchQuery
          ? `No se encontraron ${tableName} que coincidan con "${searchQuery}"`
          : `No se encontraron ${tableName} .`}
      </p>
      {searchQuery && (
        <button
          onClick={onClearSearch}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          Limpiar búsqueda
        </button>
      )}
    </div>
  );
}

export function SearchBlock({ tableName = '', searchQuery, setSearchQuery }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <input
          type="text"
          placeholder={`Buscar ${tableName}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white 
                            dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 
                            dark:hover:text-gray-200"
        >
          Limpiar
        </button>
      )}
    </div>
  );
}

export function TableSkeleton(columnsNumber = 3) {
  return (
    <div className="space-y-4">
      {/* Desktop Skeleton */}
      <div className="hidden lg:block">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {Array(columnsNumber)
                  .fill(0)
                  .map((_, i) => (
                    <th key={i} className="px-6 py-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array(columnsNumber)
                .fill(0)
                .map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array(5)
                      .fill(0)
                      .map((_, colIndex) => (
                        <td key={colIndex} className="px-6 py-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Skeleton */}
      <div className="block lg:hidden space-y-3">
        {Array(columnsNumber)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-48 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export function TableViewCard(processedData) {
  return (
    <div className="space-y-3">
      {processedData.map((location) => (
        <div
          key={location.id_location}
          className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 
                                dark:border-gray-700 overflow-hidden"
        >
          {/*Header de la card*/}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <RectangleStackIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {location.location_name}
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-1"></div>

          {/*Detalles de la card*/}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <RectangleStackIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-300 truncate">
                {location.location_name}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm truncate ">
                <RectangleStackIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span
                  className="inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                                            bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {location.location_description}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  {formatDate(location.create_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
