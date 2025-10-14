import { fetchCategories } from '@/app/dashboard/category/actions';
import { fetchForms } from '@/app/dashboard/form/actions';
import { fetchLocations } from '@/app/dashboard/location/actions';
import { useEffect, useState } from 'react';

/**
 * Hook para cargar lista completa de catálogos relacionados con el medicamento
 * @returns {Object} Categories, Forms y Locations
 * @throws {Error} If there is an error loading the categories
 */
export function useMedicineCatalogs() {
  const [categories, setCategories] = useState([]);
  const [forms, setForms] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      // Llamada a la API fetchCategories(Server Action)
      const response = await fetchCategories();
      setCategories(response.categories);
      return categories;
    } catch (err) {
      console.error('Error loading categories:', err);
      setError(`Error loading categories: ${err}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Llamada a la API fetchForms(Server Action)
  const loadForms = async () => {
    try {
      const response = await fetchForms();
      setForms(response.forms);
      //console.log('Forms:', response);
      return forms;
    } catch (err) {
      console.error('Error loading forms:', err);
      setError(`Error loading forms: ${err}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Llamada a la API fetchLocations(Server Action)
  const loadLocations = async () => {
    try {
      const response = await fetchLocations();
      setLocations(response.locations);
      //console.log('Locations:', response);
      return locations;
    } catch (err) {
      console.error('Error loading locations:', err);
      setError(`Error loading locations: ${err}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadForms();
    loadLocations();
  }, []);

  //const categories = await fetchCategories();
  //const forms = await fetchForms();
  //const locations = await fetchLocations();
  return { categories, forms, locations, loading, error, loadCategories, loadForms, loadLocations };
}
