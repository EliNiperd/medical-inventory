// hooks/useTable.js - VERSIÓN CORREGIDA
'use client';

import { useState, useCallback, useMemo } from 'react';

// Hook principal para manejar estado de tablas - EXPORTACIÓN CORREGIDA
export function useTable({
  initialData = [],
  initialSort = { key: '', order: 'asc' },
  initialFilters = {},
  itemsPerPage = 10,
} = {}) {
  // ← Agregar default para evitar errores de destructuring
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState(initialSort.key);
  const [sortOrder, setSortOrder] = useState(initialSort.order);
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Función para ordenar
  const handleSort = useCallback((key, order) => {
    setSortBy(key);
    setSortOrder(order);
  }, []);

  // Función para filtrar
  const handleFilter = useCallback((filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
    setCurrentPage(1);
  }, []);

  // Función para buscar
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  // Función para cambiar página
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Datos procesados
  const processedData = useMemo(() => {
    let result = [...data];

    // Aplicar búsqueda
    if (searchQuery) {
      result = result.filter((item) =>
        Object.values(item).some(
          (value) => value && String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        result = result.filter((item) => {
          if (Array.isArray(value)) {
            return value.includes(item[key]);
          }
          return String(item[key] || '')
            .toLowerCase()
            .includes(String(value).toLowerCase());
        });
      }
    });

    // Aplicar ordenamiento
    if (sortBy) {
      result.sort((a, b) => {
        const aVal = a[sortBy] || '';
        const bVal = b[sortBy] || '';

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }

        if (sortOrder === 'asc') {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
      });
    }

    return result;
  }, [data, searchQuery, filters, sortBy, sortOrder]);

  // Datos paginados
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  // Información de paginación
  const paginationInfo = useMemo(
    () => ({
      totalItems: processedData.length,
      totalPages: Math.ceil(processedData.length / itemsPerPage),
      currentPage,
      itemsPerPage,
      hasNextPage: currentPage < Math.ceil(processedData.length / itemsPerPage),
      hasPrevPage: currentPage > 1,
    }),
    [processedData.length, currentPage, itemsPerPage]
  );

  return {
    // Datos
    data: paginatedData,
    allData: processedData,
    originalData: data,

    // Estado
    loading,
    sortBy,
    sortOrder,
    filters,
    searchQuery,

    // Paginación
    ...paginationInfo,

    // Funciones
    setData,
    setLoading,
    handleSort,
    handleFilter,
    handleSearch,
    handlePageChange,

    // Utilidades
    clearFilters: useCallback(() => {
      setFilters(initialFilters);
      setSearchQuery('');
      setCurrentPage(1);
    }, [initialFilters]),

    refresh: useCallback(() => {
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
    }, []),
  };
}

// ASEGURAR EXPORTACIÓN DEFAULT TAMBIÉN
export default useTable;
