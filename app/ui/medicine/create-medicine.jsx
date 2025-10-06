'use client';

import {
  DocumentTextIcon,
  ExclamationTriangleIcon,
  SquaresPlusIcon,
  RectangleGroupIcon,
  RectangleStackIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';
import { useState, useCallback, useEffect } from 'react';
import InputNombre from '../medicine/input-nombre';
import { createMedicine } from '@/app/dashboard/medicine/actions';
import OCRUploader from '@/app/ui/components/form/OCRUploader';
import ResponsiveFormWrapper, {
  ResponsiveGrid,
  ResponsiveField,
} from '@/app/ui/components/form/responsive-form-wrapper';
import FooterForm from '@/app/ui/components/form/footer-form';
import FormInput from '@/app/ui/components/form/form-input';
import Link from 'next/link';
import { SubmitButton } from '@/app/ui/components/form/button-form';

// 1️⃣ Diccionario de títulos para el formulario
const DICTIONARY_TITLE = {
  nameSingular: 'Medicina',
  namePlural: 'Medicinas',
};

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
  price: { required: true, min: 0, type: 'number' },
};

// Hook personalizado para validación
function useFormValidation(formData, rules) {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateField = useCallback(
    (name, value) => {
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
    },
    [rules]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};
    let hasErrors = false;

    Object.keys(rules).forEach((field) => {
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

  const validateSingleField = useCallback(
    (name, value) => {
      const error = validateField(name, value);
      setErrors((prev) => {
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
    },
    [validateField]
  );

  return { errors, isValid, validateForm, validateSingleField };
}

export default function CreateMedicineForm({ categories = [], forms = [], locations = [] }) {
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
    price: '',
  });

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { errors, isValid, validateForm, validateSingleField } = useFormValidation(
    formData,
    VALIDATION_RULES
  );

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
    //console.log('Medicamento seleccionado:', suggestion);
    if (suggestion) {
      setSelectedMedicine(suggestion);
      setFormData((prevData) => ({
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
      setFormData((prevData) => ({
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
      suggestion.registro_sanitario &&
        `Registro Sanitario (COFEPRIS): ${suggestion.registro_sanitario}`,
      suggestion.tipo_receta && `Tipo receta: ${suggestion.tipo_receta}`,
      `Precio referencia: ${suggestion.precio_referencia || 'N/A'}`,
    ].filter(Boolean);

    return parts.join('. ') + '.';
  }, []);

  // Encontrar categoría por nombre
  const findCategoryByName = useCallback(
    (name) => {
      const category = categories.find((cat) =>
        cat.category_name.toLowerCase().includes(name.toLowerCase())
      );
      return category?.id_category || '';
    },
    [categories]
  );

  // Encontrar forma por nombre
  const findFormByName = useCallback(
    (name) => {
      const form = forms.find((f) => f.form_name.toLowerCase().includes(name.toLowerCase()));
      return form?.id_form || '';
    },
    [forms]
  );

  // Manejar cambios en campos del formulario
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      //console.log('🔄 Input change:', { name, value }); // Debug

      setFormData((prevData) => {
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
    },
    [selectedMedicine, submitError]
  );

  // Manejar envío del formulario
  const handleSubmit = useCallback(
    async (e) => {
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
            price: '',
          });
          setSelectedMedicine(null);
          setSubmitSuccess(false);
        }, 2000);
      } catch (error) {
        console.error('❌ Error creating medicine:', error);
        setSubmitError(
          error.message || 'Error al guardar el medicamento. Por favor, inténtalo de nuevo.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, errors]
  );

  // Componente para mostrar errores de campo
  const FieldError = ({ error }) =>
    error && selectedMedicine !== null ? (
      <div className="mt-1 flex items-center text-sm text-red-600">
        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
        {error}
      </div>
    ) : null;
  return (
    <>
      <ResponsiveFormWrapper
        title={`Crear ${DICTIONARY_TITLE.nameSingular}`}
        subtitle={`Ingresa la información de la nueva ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
        maxWidth="4xl"
      >
        <form onSubmit={handleSubmit}>
          {/* 0️⃣ Contenedor de campos */}
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 2 }}>
            {/* 1️⃣ Row 1 con 1 campo */}
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <OCRUploader />
            </ResponsiveField>
            {/* 2️⃣ Row 2 con 1 campo */}
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              {/* Búsqueda de Medicamento */}
              <div className="md:col-span-2">
                <label>Buscar Medicamento</label>
                <InputNombre
                  onSuggestionSelected={handleMedicineSelected}
                  placeholder="Busca por nombre comercial del medicamento..."
                  initialValue={formData.name}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Busca el medicamento para autocompletar la información básica
                </p>
              </div>
            </ResponsiveField>
            {/* 3️⃣ Row 3 con 1 campo */}
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FormInput
                label="Nombre comercial"
                type="text"
                id="name"
                name="name"
                icon={BeakerIcon}
                value={formData.name}
                onChange={handleInputChange}
                onBlur={formData.handleBlur}
                placeholder="Nombre comercial del medicamento"
                disabled={selectedMedicine !== null}
                error={errors.name}
              />
            </ResponsiveField>
            {/* 4️⃣ Row 4 con 1 campo */}
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FormInput
                label="Descripción"
                id="description"
                name="description"
                type="textarea"
                required
                icon={DocumentTextIcon}
                value={formData.description}
                onChange={handleInputChange}
                onBlur={formData.handleBlur}
                error={errors.description}
                placeholder="Descripción del medicamento"
              />
            </ResponsiveField>
            {/* 5️⃣ Row 5 con 2 campos */}
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                type="select"
                name="category"
                label="Categoría"
                icon={SquaresPlusIcon}
                options={categories}
                optionValueKey="id_category" // Key para el valor en objetos
                optionLabelKey="category_name" // Key para el label en objetos
                value={formData.category}
                onChange={handleInputChange}
                error={errors.category}
                onBlur={formData.handleBlur}
                required
                placeholder="Seleccionar categoría"
                //helperText="Categoría del medicamento"
                //showEmptyOption
                //emptyOptionLabel="-- Seleccione una categoría --"
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                type="select"
                name="form"
                label="Forma/Tipo"
                icon={RectangleGroupIcon}
                options={forms}
                optionValueKey="id_form" // Key para el valor en objetos
                optionLabelKey="form_name" // Key para el label en objetos
                value={formData.form}
                onChange={handleInputChange}
                error={errors.form}
                onBlur={formData.handleBlur}
                required
              />
            </ResponsiveField>
            {/* 6️⃣ Row 6 con 2 campos*/}
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                label="Cantidad"
                name="quantity"
                type="number"
                required
                value={formData.quantity}
                onChange={handleInputChange}
                error={errors.quantity}
                onBlur={formData.handleBlur}
                placeholder="Cantidad en stock"
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                label="Unidades por paquete"
                name="packsize"
                type="number"
                required
                value={formData.packsize}
                onChange={handleInputChange}
                error={errors.packsize}
                onBlur={formData.handleBlur}
                placeholder="unidades"
              />
            </ResponsiveField>
            {/* 7️⃣ Row 7 con 2 campos */}
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                label="Punto de reposición"
                name="reorder_point"
                type="number"
                required
                value={formData.reorder_point}
                onChange={handleInputChange}
                error={errors.reorder_point}
                onBlur={formData.handleBlur}
                placeholder="reorder"
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                label="Fecha de caducidad"
                name="expirationDate"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.expirationDate}
                onChange={handleInputChange}
                error={errors.expirationDate}
                onBlur={formData.handleBlur}
                placeholder="Fecha de caducidad"
              />
            </ResponsiveField>
            {/* 8️⃣ Row 8 con 2 campos */}
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                type="select"
                name="location"
                label="Ubicación"
                icon={RectangleStackIcon}
                options={locations}
                optionValueKey="id_location" // Key para el valor en objetos
                optionLabelKey="location_name" // Key para el label en objetos
                value={formData.location}
                onChange={handleInputChange}
                error={errors.location}
                onBlur={formData.handleBlur}
                required
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                label="Precio(MXN)"
                name="price"
                type="number"
                required
                value={formData.price}
                onChange={handleInputChange}
                error={errors.price}
                onBlur={formData.handleBlur}
                placeholder="Precio del medicamento"
              />
            </ResponsiveField>
            {/* 9️⃣ Row 9 con 1 campo - footer */}
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FooterForm>
                <Link href="/dashboard/medicine" className="btn-form-cancel">
                  Cancelar
                </Link>
                <SubmitButton
                  // Se recupera el estado 'isPending' del formulario, para desactivar el botón mientras se envía el formulario
                  isPending={formData.isSubmitting}
                  // El botón se deshabilita si el formulario no es válido o está en 'pending'
                  disabled={!formData.isValid}
                  loadingText="Guardando..."
                >
                  Guardar
                </SubmitButton>
              </FooterForm>
            </ResponsiveField>
          </ResponsiveGrid>
        </form>
      </ResponsiveFormWrapper>
    </>
  );
}
