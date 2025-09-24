// components/ui/components/responsive-table/index.jsx - SISTEMA MODULAR
'use client';

import { useState, useMemo, createContext, useContext } from 'react';

// Contexto para compartir configuración
const TableContext = createContext();

// Hook para acceder al contexto
function useTable() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within a ResponsiveTable');
  }
  return context;
}

// 🏗️ COMPONENTE PRINCIPAL
export default function ResponsiveTable({ 
  data = [], 
  columns = [],
  loading = false,
  searchable = true,
  sortable = true,
  emptyState,
  className = '',
  children, // Para componentes custom
  ...props 
}) {
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');

  // Procesar datos
  const processedData = useMemo(() => {
    let result = [...data];

    // Búsqueda
    if (searchQuery && searchable) {
      result = result.filter(item =>
        Object.values(item).some(value =>
          value && String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Ordenamiento
    if (sortBy && sortable) {
      result.sort((a, b) => {
        const aVal = a[sortBy] || '';
        const bVal = b[sortBy] || '';
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortOrder === 'asc' 
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        
        return sortOrder === 'asc' 
          ? (aVal < bVal ? -1 : aVal > bVal ? 1 : 0)
          : (aVal > bVal ? -1 : aVal < bVal ? 1 : 0);
      });
    }

    return result;
  }, [data, searchQuery, sortBy, sortOrder, searchable, sortable]);

  const handleSort = (key) => {
    if (!sortable) return;
    
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const contextValue = {
    data: processedData,
    columns,
    sortBy,
    sortOrder,
    handleSort,
    loading,
    searchQuery,
    setSearchQuery,
    searchable,
    sortable
  };

  if (loading) {
    return (
      <TableContext.Provider value={contextValue}>
        <div className={className}>
          <TableSkeleton />
        </div>
      </TableContext.Provider>
    );
  }

  if (!processedData || processedData.length === 0) {
    return emptyState || <DefaultEmptyState searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')} />;
  }

  return (
    <TableContext.Provider value={contextValue}>
      <div className={`space-y-4 ${className}`} {...props}>
        {children}
      </div>
    </TableContext.Provider>
  );
}

// 🔍 COMPONENTE DE BÚSQUEDA REUTILIZABLE
function TableSearch({ placeholder = "Buscar...", className = "" }) {
  const { searchQuery, setSearchQuery, searchable } = useTable();
  
  if (!searchable) return null;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Limpiar
        </button>
      )}
    </div>
  );
}

// 📊 VISTA DESKTOP MODULAR
function DesktopTable({ className = "" }) {
  const { data, columns, sortBy, sortOrder, handleSort, sortable } = useTable();

  return (
    <div className={`hidden lg:block ${className}`}>
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {columns.map((column) => (
                <TableHeader key={column.key} column={column} />
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, index) => (
              <TableRow key={row.id || index} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 📱 VISTA TABLET MODULAR
function TabletTable({ className = "" }) {
  const { data, columns } = useTable();
  
  const primaryColumn = columns.find(col => col.primary) || columns[0];
  const secondaryColumns = columns.filter(col => col.showOnTablet && col.key !== primaryColumn?.key);
  const actionsColumn = columns.find(col => col.type === 'actions');

  return (
    <div className={`hidden md:block lg:hidden ${className}`}>
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <TableHeader column={primaryColumn} />
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Información
              </th>
              {actionsColumn && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, index) => (
              <tr key={row.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <TableCell column={primaryColumn} row={row} />
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {secondaryColumns.map((column) => (
                      <div key={column.key} className="text-sm">
                        <TableCell column={column} row={row} inline />
                      </div>
                    ))}
                  </div>
                </td>
                {actionsColumn && <TableCell column={actionsColumn} row={row} />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 📱 VISTA MOBILE MODULAR 
function MobileCards({ cardComponent: Card, className = "" }) {
  const { data } = useTable();

  if (Card) {
    return (
      <div className={`block md:hidden space-y-3 ${className}`}>
        {data.map((row, index) => (
          <Card key={row.id || index} data={row} />
        ))}
      </div>
    );
  }

  return (
    <div className={`block md:hidden space-y-3 ${className}`}>
      {data.map((row, index) => (
        <DefaultCard key={row.id || index} data={row} />
      ))}
    </div>
  );
}

// 🧱 COMPONENTES ATÓMICOS REUTILIZABLES

// Header de tabla con ordenamiento
function TableHeader({ column }) {
  const { sortBy, sortOrder, handleSort, sortable } = useTable();
  
  if (!column) return null;

  const isSorted = sortBy === column.key;
  const canSort = column.sortable && sortable;

  return (
    <th 
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
        canSort ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' : ''
      }`}
      onClick={canSort ? () => handleSort(column.key) : undefined}
    >
      <div className="flex items-center space-x-1">
        <span>{column.header}</span>
        {canSort && isSorted && (
          <span className="text-blue-500">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );
}

// Celda de tabla reutilizable
function TableCell({ column, row, inline = false }) {
  if (!column) return null;

  const value = row[column.key];
  const content = column.render ? column.render(value, row) : value;
  
  if (inline) {
    return content;
  }

  const cellClasses = `px-6 py-4 whitespace-nowrap ${column.className || ''} ${
    column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : ''
  }`;

  return <td className={cellClasses}>{content}</td>;
}

// Fila de tabla reutilizable
function TableRow({ row, className = "" }) {
  const { columns } = useTable();

  return (
    <tr className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className}`}>
      {columns.map((column) => (
        <TableCell key={column.key} column={column} row={row} />
      ))}
    </tr>
  );
}

// Card por defecto para mobile
function DefaultCard({ data }) {
  const { columns } = useTable();
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="space-y-2">
        {columns.filter(col => col.type !== 'actions').map((column) => (
          <div key={column.key} className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400 font-medium">
              {column.header}:
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {column.render ? column.render(data[column.key], data) : data[column.key]}
            </span>
          </div>
        ))}
        
        {/* Acciones al final */}
        {columns.filter(col => col.type === 'actions').map((column) => (
          <div key={column.key} className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            {column.render ? column.render(data[column.key], data) : data[column.key]}
          </div>
        ))}
      </div>
    </div>
  );
}

// Estado vacío
function DefaultEmptyState({ searchQuery, onClearSearch }) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4">
        {searchQuery ? (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ) : (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1M9 7h6" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {searchQuery ? 'Sin resultados' : 'No hay datos'}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        {searchQuery 
          ? `No se encontraron resultados para "${searchQuery}"`
          : 'No hay elementos para mostrar.'
        }
      </p>
      {searchQuery && onClearSearch && (
        <button
          onClick={onClearSearch}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm"
        >
          Limpiar búsqueda
        </button>
      )}
    </div>
  );
}

// Skeleton de carga
function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="hidden lg:block">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {Array(5).fill(0).map((_, i) => (
                  <th key={i} className="px-6 py-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array(5).fill(0).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array(5).fill(0).map((_, colIndex) => (
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

      <div className="block lg:hidden space-y-3">
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 📊 COMPONENTE DE ESTADÍSTICAS REUTILIZABLE
function TableStats({ className = "" }) {
  const { data, searchQuery } = useTable();
  
  return (
    <div className={`flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      <p>
        {searchQuery ? (
          <>Mostrando {data.length} resultado{data.length !== 1 ? 's' : ''} para "{searchQuery}"</>
        ) : (
          <>Mostrando {data.length} elemento{data.length !== 1 ? 's' : ''}</>
        )}
      </p>
    </div>
  );
}

// Exportar componentes para uso externo
export { 
  TableSearch, 
  DesktopTable, 
  TabletTable, 
  MobileCards, 
  TableStats,
  TableHeader,
  TableCell,
  TableRow
};