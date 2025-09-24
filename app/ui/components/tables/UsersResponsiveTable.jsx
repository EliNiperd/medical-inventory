'use client';

import { useState, useMemo } from 'react';
import { UserIcon, EnvelopeIcon, ShieldCheckIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { UpdateUser, DeleteUser } from "@/app/ui/user/button";

// ✅ SOLUCIÓN: Todo dentro del Client Component
function UsersResponsiveTable({ users, loading = false }) {
  const [sortBy, setSortBy] = useState('user_name_full');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Columnas definidas dentro del componente cliente
  const columns = useMemo(() => [
    {
      key: 'user_name_full',
      header: 'Usuario',
      primary: true,
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          {/*<div className={`'w-2.5 h-2.5 rounded-full ${row.is_active ? 'bg-green-500' : 'bg-gray-400'}'`}></div>*/}
          <div className={`w-2.5 h-2.5 rounded-full   `}></div>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {value}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      showOnTablet: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <EnvelopeIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {value}
          </span>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Rol',
      sortable: true,
      showOnTablet: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <ShieldCheckIcon className="h-4 w-4 text-gray-400" />
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {value || 'Usuario'}
          </span>
        </div>
      )
    },
    {
      key: 'create_at',
      header: 'Fecha Alta',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {value ? new Date(value).toLocaleDateString('es-MX') : 'N/D'}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      type: 'actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <UpdateUser id={row.id_user} />
          <DeleteUser id={row.id_user} />
        </div>
      )
    }
  ], []); // Memoizar para evitar re-renders innecesarios

  // Procesar datos (búsqueda y ordenamiento)
  const processedUsers = useMemo(() => {
    let filtered = users || [];

    // Aplicar búsqueda
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.user_name_full?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Aplicar ordenamiento
    if (sortBy) {
      filtered.sort((a, b) => {
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

    return filtered;
  }, [users, searchQuery, sortBy, sortOrder]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/D";
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading skeleton
  if (loading) {
    return <TableSkeleton />;
  }

  // Estado vacío
  if (!processedUsers || processedUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
          {searchQuery ? 'Sin resultados' : 'No hay usuarios'}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {searchQuery
            ? `No se encontraron usuarios que coincidan con "${searchQuery}"`
            : 'No se encontraron usuarios registrados.'
          }
        </p>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            Limpiar búsqueda
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Barra de búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar usuarios..."
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

      {/* Vista Desktop */}
      <div className="hidden lg:block">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    onClick={() => handleSort(column.key)}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 
                      dark:text-gray-400 uppercase tracking-wider 
                      ${column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' : ''
                      }`}
                    
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.header}</span>
                      {column.sortable && sortBy === column.key && (
                        <span className="text-blue-500">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {processedUsers.map((user) => (
                <tr key={user.id_user} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.render
                        ? column.render(user[column.key], user)
                        : user[column.key]
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista Tablet */}
      <div className="hidden md:block lg:hidden">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Información
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {processedUsers.map((user) => (
                <tr key={user.id_user} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.user_name_full}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.role || 'Usuario'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDate(user.create_at)}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <UpdateUser id={user.id_user} />
                      <DeleteUser id={user.id_user} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista Mobile - Cards */}
      <div className="block md:hidden">
        <div className="space-y-3">
          {processedUsers.map((user) => (
            <div
              key={user.id_user}
              className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.user_name_full}
                  </h3>
                </div>

                <div className="flex items-center space-x-1">
                  <UpdateUser id={user.id_user} />
                  <DeleteUser id={user.id_user} />
                </div>
              </div>

              {/* Información */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300 truncate">
                    {user.email}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <ShieldCheckIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {user.role || 'Usuario'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {formatDate(user.create_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {processedUsers.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <p>
            {searchQuery ? (
              <>Mostrando {processedUsers.length} resultado{processedUsers.length !== 1 ? 's' : ''} de {searchQuery}</>
            ) : (
              <>Mostrando {processedUsers.length} usuario{processedUsers.length !== 1 ? 's' : ''}</>
            )}
          </p>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs">Activo</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <span className="text-xs">Inactivo</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton de carga
function TableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Desktop Skeleton */}
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

      {/* Mobile Skeleton */}
      <div className="block lg:hidden space-y-3">
        {Array(5).fill(0).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
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

export default UsersResponsiveTable;