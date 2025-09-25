'use client';

import { useState, useCallback, useRef, useEffect, use } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
//import { fetchSuggestData } from "@/app/api/gemini/api-medical-name-data";
import { Command } from 'cmdk';
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// Tipos para mejorar TypeScript (opcional)
const SEARCH_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
};

// Custom hook para manejar la lógica de búsqueda
function useMedicineSearch() {
  const [suggestions, setSuggestions] = useState([]);
  const [searchState, setSearchState] = useState(SEARCH_STATES.IDLE);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const searchMedicines = useCallback(async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setSearchState(SEARCH_STATES.IDLE);
      return;
    }

    // Cancelar búsqueda anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setSearchState(SEARCH_STATES.LOADING);
    setError(null);

    try {
      const response = await fetch(
        `/api/gemini/medicines/suggestions?q=${encodeURIComponent(query)}`,
        {
          signal: abortControllerRef.current.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setSearchState(SEARCH_STATES.SUCCESS);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error searching medicines:', error);
        setError('No se pudieron cargar las sugerencias. Intente de nuevo más tarde.');
        setSuggestions([]);
        setSearchState(SEARCH_STATES.ERROR);
      }
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSuggestions([]);
    setSearchState(SEARCH_STATES.IDLE);
    setError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    suggestions,
    searchState,
    error,
    searchMedicines,
    clearSearch,
  };
}

export default function InputNombre({
  onSuggestionSelected,
  initialValue = '',
  placeholder = 'Escribe el nombre del medicamento...',
  minSearchLength = 3,
  debounceMs = 500,
}) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [isListOpen, setIsListOpen] = useState(false); // New state variable
  const [isSelected, setIsSelected] = useState(false);
  const inputRef = useRef(null);

  const { suggestions, searchState, error, searchMedicines, clearSearch } = useMedicineSearch();

  const debouncedSearch = useDebounceCallback(searchMedicines, debounceMs);

  const isLoading = searchState === SEARCH_STATES.LOADING;
  const hasError = searchState === SEARCH_STATES.ERROR;

  const handleInputChange = useCallback(
    (value) => {
      setInputValue(value);

      // Si había una selección previa y el usuario está escribiendo, Limpia la selección
      if (isSelected && value !== inputValue) {
        setIsSelected(false);
        onSuggestionSelected?.(null); // Notificar al padre que se limpió la selección
      }

      // Solo buscar si no hay selección activa
      if (!isSelected) {
        if (value.length >= minSearchLength) {
          debouncedSearch(value);
        } else {
          clearSearch();
          setIsListOpen(false);
        }
      }
    },
    [inputValue, isSelected, minSearchLength, debouncedSearch, clearSearch, onSuggestionSelected]
  );

  const handleSelectSuggestion = useCallback(
    (suggestion) => {
      setInputValue(suggestion.nombre);
      setIsSelected(true);
      setIsListOpen(false);
      clearSearch();

      // Notificar al componente padre sobre la selección
      onSuggestionSelected?.(suggestion);

      // Enfocar el input después de seleccionar
      setTimeout(() => inputRef.current?.focus(), 100);
    },
    [onSuggestionSelected, clearSearch]
  );

  const handleFocus = useCallback(() => {
    if (suggestions.length > 0 && !isSelected) {
      setIsListOpen(true);
    }
  }, [suggestions, isSelected]);

  const handleBlur = useCallback(() => {
    // Usar un timeout para permitir que el click en una sugerencia se registre antes de cerrar
    setTimeout(() => setIsListOpen(false), 150);
  }, []);

  const clearInput = useCallback(() => {
    setInputValue('');
    setIsSelected(false);
    setIsListOpen(false);
    clearSearch();
    onSuggestionSelected?.(null); // Notificar al padre que se limpió la selección
    inputRef.current?.focus();
  }, [clearSearch, onSuggestionSelected]);

  // Mostrar la lista cuando hay sugerencias y no hay una selección activa
  const shouldShowList = isListOpen && suggestions.length > 0 && !isSelected;

  // Efecto para abrir la lista cuando llegan nuevas sugerencias
  useEffect(() => {
    if (suggestions.length > 0 && !isSelected) {
      setIsListOpen(true);
    }
  }, [suggestions.length, isSelected]);

  return (
    <div className="relative w-full">
      <Command label="Búsqueda de medicamentos" className="relative" shouldFilter={false}>
        <div className="relative">
          <Command.Input
            ref={inputRef}
            placeholder={placeholder}
            value={inputValue}
            onValueChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`
              input-form pr-20
              ${hasError ? 'border-red-300 focus:border-red-500' : ''}
              ${isSelected ? 'border-green-300 focus:border-green-500' : ''}
            `}
            aria-describedby="search-status"
            aria-expanded={shouldShowList}
            aria-autocomplete="list"
          />

          {/* Iconos de estado */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {inputValue && (
              <button
                type="button"
                onClick={clearInput}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}

            {isLoading ? (
              <ArrowPathIcon className="h-[18px] w-[18px] text-gray-500 animate-spin" />
            ) : (
              <MagnifyingGlassIcon className="h-[18px] w-[18px] text-gray-500" />
            )}
          </div>
        </div>

        {/* Estado de error */}
        {hasError && (
          <div id="search-status" className="mt-1 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Lista de sugerencias */}
        {shouldShowList && (
          <Command.List className="absolute z-50 mt-1 max-h-60 w-full overflow-auto bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-600">
            <div className="p-2 text-xs text-gray-500 border-b">
              {suggestions.length} resultado{suggestions.length !== 1 ? 's' : ''} encontrado
              {suggestions.length !== 1 ? 's' : ''}
            </div>

            {suggestions.map((suggestion, index) => (
              <Command.Item
                key={`${suggestion.registro_sanitario}-${index}`}
                onSelect={() => handleSelectSuggestion(suggestion)}
                className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b last:border-b-0 transition-colors"
                value={suggestion.nombre}
              >
                <div className="space-y-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {suggestion.nombre}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Dosis: {suggestion.dosis} - {suggestion.presentacion}, Contenido:{' '}
                    {suggestion.packsize}
                  </div>
                  {suggestion.laboratorio && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Laboratorio: {suggestion.laboratorio}
                    </div>
                  )}
                </div>
              </Command.Item>
            ))}
          </Command.List>
        )}
      </Command>
    </div>
  );
}
