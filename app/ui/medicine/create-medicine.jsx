"use client";

import {
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CalculatorIcon,
  InboxStackIcon,
  SwatchIcon,
  GlobeAmericasIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  QueueListIcon
} from "@heroicons/react/24/outline";
import Button from "@/app/ui/button";
import { useState, useCallback, useEffect } from "react";
import InputNombre from "../medicine/input-nombre";
import { createMedicine } from "@/app/dashboard/medicine/actions";

// Esquema de validación
const VALIDATION_RULES = {
  name: { required: true, minLength: 2 },
  description: { required: true, minLength: 10 },
  category: { required: true },
  form: { required: true },
  quantity: { required: true, min: 1, type: 'number' },
  packsize: { required: true, min: 1, type: 'number' },
  reorder_point: { required: true, min: 1, type: 'number' },
  expirationDate: { required: true, type: 'date' },
  location: { required: true },
  price: { required: true, min: 0, type: 'number' }
};

// Hook personalizado para validación
function useFormValidation(formData, rules) {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateField = useCallback((name, value) => {
    const rule = rules[name];
    if (!rule) return null;

    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return 'Este campo es obligatorio';
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      return `Mínimo ${rule.minLength} caracteres`;
    }

    if (rule.type === 'number') {
      const num = parseFloat(value);
      if (isNaN(num)) return 'Debe ser un número válido';
      if (rule.min !== undefined && num < rule.min) {
        return `El valor mínimo es ${rule.min}`;
      }
    }

    if (rule.type === 'date' && value) {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Resetear horas para comparación de fecha
      if (date <= today) {
        return 'La fecha de caducidad debe ser futura';
      }
    }

    return null;
  }, [rules]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let hasErrors = false;

    Object.keys(rules).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setIsValid(!hasErrors);

    // ✅ Debug logs
    /*console.log('🔍 Validation result:', {
      hasErrors,
      errorFields: Object.keys(newErrors),
      isValid: !hasErrors
    });
    */

    return !hasErrors;
  }, [formData, rules, validateField]);

  const validateSingleField = useCallback((name, value) => {
    const error = validateField(name, value);
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name];
      }

      // Actualizar isValid basado en los errores actuales
      const hasAnyErrors = Object.keys(newErrors).length > 0;
      setIsValid(!hasAnyErrors);

      return newErrors;
    });
    return !error;
  }, [validateField]);

  return { errors, isValid, validateForm, validateSingleField };
}

export default function CreateMedicineForm({ categorys = [], forms = [], locations = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    form: '',
    quantity: '',
    packsize: '',
    reorder_point: '',
    expirationDate: '',
    location: '',
    price: ''
  });

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { errors, isValid, validateForm, validateSingleField } = useFormValidation(formData, VALIDATION_RULES);

  // ✅ Ejecutar validación inicial y cuando cambie formData
  useEffect(() => {
    validateForm();
  }, [formData, validateForm]);

  // ✅ Debug: Ver el estado de validación
  /*useEffect(() => {
    console.log('🔍 Form validation state:', { isValid, errors, formData });
  }, [isValid, errors, formData]);*/

  // Manejar selección de medicamento del autocompletado
  const handleMedicineSelected = useCallback((suggestion) => {
    if (suggestion) {
      setSelectedMedicine(suggestion);
      setFormData(prevData => ({
        ...prevData,
        name: suggestion.nombre,
        description: formatMedicineDescription(suggestion),
        price: suggestion.precio_referencia ? parseFloat(suggestion.precio_referencia) : '',
        quantity: '1',
        reorder_point: '1',
        packsize: suggestion.packsize || '1',
        category: findCategoryByName('Medicamento') || '',
        form: findFormByName(suggestion.presentacion) || '',
      }));
    } else {
      // Limpiar selección
      setSelectedMedicine(null);
      setFormData(prevData => ({
        ...prevData,
        name: '',
        description: '',
        price: '',
        category: '',
        form: '',
      }));
    }
  }, []);

  // Formatear descripción del medicamento
  const formatMedicineDescription = useCallback((suggestion) => {
    const parts = [
      suggestion.principio_activo && `Principio activo: ${suggestion.principio_activo}`,
      suggestion.presentacion && `Presentación: ${suggestion.presentacion}`,
      suggestion.dosis && `Dosis: ${suggestion.dosis}`,
      suggestion.cantidad && `Cantidad del empaque: ${suggestion.cantidad}`,
      suggestion.laboratorio && `Laboratorio: ${suggestion.laboratorio}`,
      suggestion.registro_sanitario && `Registro Sanitario (COFEPRIS): ${suggestion.registro_sanitario}`,
      suggestion.tipo_receta && `Tipo receta: ${suggestion.tipo_receta}`,
      `Precio referencia: ${suggestion.precio_referencia || 'N/A'}`
    ].filter(Boolean);

    return parts.join('. ') + '.';
  }, []);

  // Encontrar categoría por nombre
  const findCategoryByName = useCallback((name) => {
    const category = categorys.find(cat =>
      cat.name.toLowerCase().includes(name.toLowerCase())
    );
    return category?.id_category || '';
  }, [categorys]);

  // Encontrar forma por nombre
  const findFormByName = useCallback((name) => {
    const form = forms.find(f =>
      f.form_name.toLowerCase().includes(name.toLowerCase())
    );
    return form?.id_form || '';
  }, [forms]);

  // Manejar cambios en campos del formulario
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    //console.log('🔄 Input change:', { name, value }); // Debug

    setFormData(prevData => {
      const newData = { ...prevData, [name]: value };
      //console.log('🔄 New form data:', newData); // Debug
      return newData;
    });

    // Si el usuario modifica el nombre manualmente, limpiar selección
    if (name === 'name' && selectedMedicine) {
      setSelectedMedicine(null);
    }

    // Limpiar error del submit si existe
    if (submitError) {
      setSubmitError(null);
    }
  }, [selectedMedicine, submitError]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    //console.log('🚀 Form submitted!', { formData, isValid, errors }); // Debug


    // Forzar validación antes de enviar
    const isFormValid = validateForm();

    if (!isFormValid) {
      setSubmitError('Por favor, corrija los errores en el formulario');
      console.log('❌ Form validation failed:', errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      //console.log('📤 Sending form data:', formData); //Debug

      // Llamar a la action directamente (Next.js 13+ App Router)
      const result = await createMedicine(formData);

      //console.log('✅ Medicine created:', result); //Debug
      setSubmitSuccess(true);

      // Resetear formulario después de éxito
      setTimeout(() => {
        setFormData({
          name: '',
          description: '',
          category: '',
          form: '',
          quantity: '',
          packsize: '',
          reorder_point: '',
          expirationDate: '',
          location: '',
          price: ''
        });
        setSelectedMedicine(null);
        setSubmitSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('❌ Error creating medicine:', error);
      setSubmitError(error.message || 'Error al guardar el medicamento. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, errors]);

  // Componente para mostrar errores de campo
  const FieldError = ({ error }) => (
    error && selectedMedicine !== null ? (
      <div className="mt-1 flex items-center text-sm text-red-600">
        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
        {error}
      </div>
    ) : null
  );

  return (
    <div className="max-w-4xl p-6">
      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-green-800">¡Medicamento guardado exitosamente!</span>
          </div>
        </div>
      )}

      {submitError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-800">{submitError}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} >
        <div className="form-basic grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Búsqueda de Medicamento */}
          <div className="md:col-span-2">
            <label >
              Buscar Medicamento
            </label>
            <InputNombre
              onSuggestionSelected={handleMedicineSelected}
              placeholder="Busca por nombre comercial del medicamento..."
              initialValue={formData.name}
            />
            <p className="mt-1 text-sm text-gray-500">
              Busca el medicamento para autocompletar la información básica
            </p>
          </div>

          {/* Nombre del Medicamento */}
          <div className="md:col-span-2">
            <label htmlFor="name" >
              Nombre del Medicamento *
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nombre comercial del medicamento"
                className={`input-form ${errors.name ? 'border-red-300 focus:border-red-500' : ''}`}
                disabled={selectedMedicine !== null}
              />
              <QueueListIcon className="icon-input " />
            </div>
            <FieldError error={errors.name} />
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label htmlFor="description" >
              Descripción *
            </label>
            <div className="relative">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descripción del medicamento (principio activo, uso, etc.)"
                rows="4"
                className={`input-form ${errors.description ? 'border-red-300 focus:border-red-500' : ''}`}
              />
              <DocumentTextIcon className="icon-input top-6" />
            </div>
            <FieldError error={errors.description} />
          </div>

          {/* Categoría */}
          <div>
            <label htmlFor="category" >
              Categoría *
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`input-form cursor-pointer ${errors.category ? 'border-red-300 focus:border-red-500' : ''}`}
              >
                <option value="">Seleccionar categoría</option>
                {categorys.map((category) => (
                  <option key={category.id_category} value={category.id_category}>
                    {category.name}
                  </option>
                ))}
              </select>
              <InboxStackIcon className="icon-input" />
            </div>
            <FieldError error={errors.category} />
          </div>

          {/* Presentación */}
          <div>
            <label htmlFor="form" >
              Presentación *
            </label>
            <div className="relative">
              <select
                id="form"
                name="form"
                value={formData.form}
                onChange={handleInputChange}
                className={`input-form cursor-pointer ${errors.form ? 'border-red-300 focus:border-red-500' : ''}`}
              >
                <option value="">Seleccionar presentación</option>
                {forms.map((form) => (
                  <option key={form.id_form} value={form.id_form}>
                    {form.form_name}
                  </option>
                ))}
              </select>
              <SwatchIcon className="icon-input" />
            </div>
            <FieldError error={errors.form} />
          </div>

          {/* Cantidad */}
          <div>
            <label htmlFor="quantity" >
              Cantidad en Stock *
            </label>
            <div className="relative">
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="1"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="0"
                className={`input-form-number ${errors.quantity ? 'border-red-300 focus:border-red-500' : ''}`}
              />
              <CalculatorIcon className="icon-input" />
            </div>
            <FieldError error={errors.quantity} />
          </div>

          {/* Tamaño del Paquete */}
          <div>
            <label htmlFor="packsize" >
              Unidades por Paquete *
            </label>
            <div className="relative">
              <input
                id="packsize"
                name="packsize"
                type="number"
                min="1"
                step="1"
                value={formData.packsize}
                onChange={handleInputChange}
                placeholder="1"
                className={`input-form-number ${errors.packsize ? 'border-red-300 focus:border-red-500' : ''}`}
              />
              <CalculatorIcon className="icon-input" />
            </div>
            <FieldError error={errors.packsize} />
          </div>

          {/* Punto de Reorden */}
          <div>
            <label htmlFor="reorder_point" >
              Punto de Reorden *
            </label>
            <div className="relative">
              <input
                id="reorder_point"
                name="reorder_point"
                type="number"
                min="0"
                step="1"
                value={formData.reorder_point}
                onChange={handleInputChange}
                placeholder="0"
                className={`input-form-number ${errors.reorder_point ? 'border-red-300 focus:border-red-500' : ''}`}
              />
              <CalculatorIcon className="icon-input" />
            </div>
            <FieldError error={errors.reorder_point} />
            <p className="mt-1 text-sm text-gray-500">
              Cantidad mínima antes de hacer nuevo pedido
            </p>
          </div>

          {/* Fecha de Caducidad */}
          <div>
            <label htmlFor="expirationDate" >
              Fecha de Caducidad *
            </label>
            <div className="relative">
              <input
                id="expirationDate"
                name="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={`input-form-number ${errors.expirationDate ? 'border-red-300 focus:border-red-500' : ''}`}
              />
              <CalendarIcon className="icon-input" />
            </div>
            <FieldError error={errors.expirationDate} />
          </div>

          {/* Ubicación */}
          <div>
            <label htmlFor="location" >
              Ubicación *
            </label>
            <div className="relative">
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`input-form cursor-pointer ${errors.location ? 'border-red-300 focus:border-red-500' : ''}`}
              >
                <option value="">Seleccionar ubicación</option>
                {locations.map((location) => (
                  <option key={location.id_location} value={location.id_location}>
                    {location.location_name}
                  </option>
                ))}
              </select>
              <GlobeAmericasIcon className="icon-input" />
            </div>
            <FieldError error={errors.location} />
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="price" >
              Precio (MXN) *
            </label>
            <div className="relative">
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                className={`input-form-number ${errors.price ? 'border-red-300 focus:border-red-500' : ''}`}
              />
              <CurrencyDollarIcon className="icon-input" />
            </div>
            <FieldError error={errors.price} />
          </div>
          {/* Botones de Acción */}
          <div className="col-span-2 flex justify-end gap-4 pt-2 border-t">
            {/* Debug info - remover en producción 
          <div className="text-xs text-gray-500 mr-4">
            <div>Valid: {isValid ? '✅' : '❌'}</div>
            <div>Errors: {Object.keys(errors).length}</div>
            <div>Submitting: {isSubmitting ? '⏳' : '✅'}</div>
          </div>
          */}
            <Button
              type="button"
              className="btn-form-cancel"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className={`btn-primary ${(!isValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isValid || isSubmitting}
              onClick={(e) => {
                console.log('🔴 Button clicked!', { isValid, isSubmitting, errors });
                // El handleSubmit se ejecutará automáticamente por el form
              }}
            >
              {isSubmitting ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Medicamento'
              )}
            </Button>
          </div>
        </div>


      </form>
    </div>
  );
}