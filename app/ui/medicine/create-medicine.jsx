'use client';

import {
  DocumentTextIcon,
  SquaresPlusIcon,
  RectangleGroupIcon,
  RectangleStackIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';
import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useForm, useSchemaValidation } from '@/app/hooks/useFormValidation';
import { createMedicine } from '@/app/dashboard/medicine/actions';

import InputNombre from '../medicine/input-nombre';
import OCRUploader from '@/app/ui/components/form/OCRUploader';
import ResponsiveFormWrapper, {
  ResponsiveGrid,
  ResponsiveField,
} from '@/app/ui/components/form/responsive-form-wrapper';
import FooterForm from '@/app/ui/components/form/footer-form';
import FormInput from '@/app/ui/components/form/form-input';
import { SubmitButton } from '@/app/ui/components/form/button-form';

const DICTIONARY_TITLE = {
  nameSingular: 'Medicina',
  namePlural: 'Medicinas',
};

export default function CreateMedicineForm({ categories = [], forms = [], locations = [] }) {
  const VALIDATION_RULES = useSchemaValidation('medicine');

  const {
    formData,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    reset,
  } = useForm(
    {
      name: '',
      description: '',
      idCategory: '',
      idForm: '',
      quantity: '',
      packsize: '',
      reorder_point: '',
      expiration_date: '',
      idLocation: '',
      price: '',
    },
    VALIDATION_RULES
  );

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // State for OCR
  const [ocrResult, setOcrResult] = useState(null);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState(null);

  const findCategoryByName = useCallback(
    (name) => {
      const category = categories.find((cat) =>
        cat.category_name.toLowerCase().includes(name.toLowerCase())
      );
      return category?.id_category || '';
    },
    [categories]
  );

  const findFormByName = useCallback(
    (name) => {
      const form = forms.find((f) => f.form_name.toLowerCase().includes(name.toLowerCase()));
      return form?.id_form || '';
    },
    [forms]
  );

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

  const handleMedicineSelected = useCallback(
    (suggestion) => {
      if (suggestion) {
        setSelectedMedicine(suggestion);
        setFieldValue('name', suggestion.nombre);
        setFieldValue('description', formatMedicineDescription(suggestion));
        setFieldValue(
          'price',
          suggestion.precio_referencia ? parseFloat(suggestion.precio_referencia) : ''
        );
        setFieldValue('quantity', '1');
        setFieldValue('reorder_point', '1');
        setFieldValue('packsize', suggestion.packsize || '1');
        setFieldValue('idCategory', findCategoryByName('Medicamento') || '');
        setFieldValue('idForm', findFormByName(suggestion.presentacion) || '');
      } else {
        setSelectedMedicine(null);
        reset();
      }
    },
    [setFieldValue, reset, findCategoryByName, findFormByName, formatMedicineDescription]
  );

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const result = await handleSubmit(async (data) => {
      return createMedicine(data);
    });

    if (result.success) {
      setSubmitSuccess(true);
      setSubmitError(null);
      setTimeout(() => {
        reset();
        setSelectedMedicine(null);
        setSubmitSuccess(false);
      }, 2000);
    } else {
      setSubmitError(result.error || 'Error al guardar el medicamento.');
    }
  };

  // OCR Handlers
  const handleOcrStart = () => {
    setIsOcrLoading(true);
    setOcrError(null);
    setOcrResult(null);
  };

  const handleOcrSuccess = async (data) => {
    setIsOcrLoading(false);
    setOcrResult(data);

    try {
      // Use the correct suggestions API
      const response = await fetch(
        `/api/gemini/medicines/suggestions?q=${encodeURIComponent(data.text)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch medicine suggestions');
      }

      const result = await response.json();

      // The API returns an object with a `suggestions` array.
      // We take the first one as the most likely match.
      const suggestion = result.suggestions?.[0];

      if (suggestion) {
        handleMedicineSelected(suggestion);
      }
    } catch (error) {
      console.error('Error fetching suggestions from OCR text:', error);
      setOcrError(error.message);
    }
  };

  const handleOcrError = (error) => {
    setIsOcrLoading(false);
    setOcrError(error);
  };

  return (
    <>
      <ResponsiveFormWrapper
        title={`Crear ${DICTIONARY_TITLE.nameSingular}`}
        subtitle={`Ingresa la información de la nueva ${String(
          DICTIONARY_TITLE.nameSingular
        ).toLowerCase()}`}
        maxWidth="4xl"
      >
        <form onSubmit={handleFormSubmit}>
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 2 }}>
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <label
                htmlFor="search-medicine"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Buscar Medicamento
              </label>
              <div className="relative flex items-center gap-x-2">
                <InputNombre
                  id="search-medicine"
                  onSuggestionSelected={handleMedicineSelected}
                  placeholder="Busca por nombre comercial o escanea con OCR..."
                  initialValue={formData.name}
                  className="flex-grow"
                />
                <OCRUploader
                  onUploadStart={handleOcrStart}
                  onSuccess={handleOcrSuccess}
                  onError={handleOcrError}
                  className="flex-shrink-0 md:order-2"
                  variant="discreet"
                />
              </div>
              {isOcrLoading && (
                <p className="mt-1 text-sm text-blue-600">Procesando imagen OCR...</p>
              )}
              {ocrError && <p className="mt-1 text-sm text-red-600">Error de OCR: {ocrError}</p>}
              {ocrResult && (
                <p className="hidden md:block mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Texto escaneado: "{ocrResult.text.substring(0, 50)}..."
                </p>
              )}
            </ResponsiveField>

            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FormInput
                label="Nombre comercial"
                type="text"
                id="name"
                name="name"
                icon={BeakerIcon}
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Nombre comercial del medicamento"
                //disabled={selectedMedicine !== null}
                error={touched.name && errors.name}
              />
            </ResponsiveField>

            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FormInput
                label="Descripción"
                id="description"
                name="description"
                type="textarea"
                required
                icon={DocumentTextIcon}
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && errors.description}
                placeholder="Descripción del medicamento"
              />
            </ResponsiveField>

            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                type="select"
                name="idCategory"
                label="Categoría"
                icon={SquaresPlusIcon}
                options={categories}
                optionValueKey="id_category"
                optionLabelKey="category_name"
                value={formData.idCategory}
                onChange={handleChange}
                error={touched.idCategory && errors.idCategory}
                onBlur={handleBlur}
                required
                placeholder="Seleccionar categoría"
              />
            </ResponsiveField>

            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                type="select"
                name="idForm"
                label="Forma/Tipo"
                icon={RectangleGroupIcon}
                options={forms}
                optionValueKey="id_form"
                optionLabelKey="form_name"
                value={formData.idForm}
                onChange={handleChange}
                error={touched.idForm && errors.idForm}
                onBlur={handleBlur}
                required
              />
            </ResponsiveField>

            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                label="Cantidad"
                name="quantity"
                type="number"
                required
                value={formData.quantity}
                onChange={handleChange}
                error={touched.quantity && errors.quantity}
                onBlur={handleBlur}
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
                onChange={handleChange}
                error={touched.packsize && errors.packsize}
                onBlur={handleBlur}
                placeholder="unidades"
              />
            </ResponsiveField>

            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                label="Punto de reposición"
                name="reorder_point"
                type="number"
                required
                value={formData.reorder_point}
                onChange={handleChange}
                error={touched.reorder_point && errors.reorder_point}
                onBlur={handleBlur}
                placeholder="reorder"
              />
            </ResponsiveField>

            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                label="Fecha de caducidad"
                name="expiration_date"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.expiration_date}
                onChange={handleChange}
                error={touched.expiration_date && errors.expiration_date}
                onBlur={handleBlur}
                placeholder="Fecha de caducidad"
              />
            </ResponsiveField>

            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                type="select"
                name="idLocation"
                label="Ubicación"
                icon={RectangleStackIcon}
                options={locations}
                optionValueKey="id_location"
                optionLabelKey="location_name"
                value={formData.idLocation}
                onChange={handleChange}
                error={touched.idLocation && errors.idLocation}
                onBlur={handleBlur}
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
                onChange={handleChange}
                error={touched.price && errors.price}
                onBlur={handleBlur}
                placeholder="Precio del medicamento"
              />
            </ResponsiveField>

            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FooterForm>
                <Link href="/dashboard/medicine" className="btn-form-cancel">
                  Cancelar
                </Link>
                <SubmitButton
                  isPending={isSubmitting}
                  disabled={!isValid || isSubmitting}
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
