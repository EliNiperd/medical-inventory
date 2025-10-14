'use client';

import {
  DocumentTextIcon,
  SquaresPlusIcon,
  RectangleGroupIcon,
  RectangleStackIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useForm } from '@/app/hooks/useFormValidation';
import { medicineSchema } from '@/lib/schemas/medicine';
import { createMedicine, updateMedicine } from '@/app/dashboard/medicine/actions';
import InputNombre from '../medicine/input-nombre';
import OCRUploader from '@/app/ui/components/form/OCRUploader';
import ResponsiveFormWrapper, {
  ResponsiveGrid,
  ResponsiveField,
} from '@/app/ui/components/form/responsive-form-wrapper';
import FooterForm from '@/app/ui/components/form/footer-form';
import FormInput from '@/app/ui/components/form/form-input';
import { SubmitButton } from '@/app/ui/components/form/button-form';
import { toast } from 'sonner';
import { useMedicineCatalogs } from '@/app/hooks/useMedicine';

//, categories = [], forms = [], locations = []
export default function MedicineForm({ medicine }) {
  const { categories, forms, locations } = useMedicineCatalogs();
  const isEditMode = Boolean(medicine);

  const DICTIONARY_TITLE = {
    nameSingular: 'Medicina',
    create: `Crear ${'Medicina'}`,
    edit: `Editar ${'Medicina'}`,
    createSubtitle: `Ingresa la información de la nueva ${'Medicina'.toLowerCase()}`,
    editSubtitle: `Actualiza la información de la ${'Medicina'.toLowerCase()}`,
  };

  // Formatear los datos iniciales para el hook, asegurando que los valores sean strings
  const getInitialData = () => {
    if (isEditMode) {
      return {
        name: medicine.name || '',
        description: medicine.description || '',
        idCategory: String(medicine.idCategory || ''),
        idForm: medicine.idForm || '',
        quantity: String(medicine.quantity || '0'),
        packsize: String(medicine.packsize || '1'),
        reorder_point: String(medicine.reorder_point || '0'),
        expiration_date: medicine.expiration_date
          ? new Date(medicine.expiration_date).toISOString().split('T')[0]
          : '',
        idLocation: medicine.idLocation || '',
        price: String(medicine.price || '0'),
      };
    }
    return {
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
    };
  };

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
    setErrors,
    reset,
  } = useForm(getInitialData(), medicineSchema);

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  //const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState(null);

  const findCategoryByName = useCallback(
    (name) => {
      const category = categories.find((cat) =>
        cat.category_name.toLowerCase().includes(name.toLowerCase())
      );
      return category ? String(category.id_category) : '';
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
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setSelectedMedicine(suggestion);
        setFieldValue('name', suggestion.nombre);
        setFieldValue('description', formatMedicineDescription(suggestion));
        setFieldValue(
          'price',
          suggestion.precio_referencia ? String(parseFloat(suggestion.precio_referencia)) : '0'
        );
        setFieldValue('quantity', '1');
        setFieldValue('reorder_point', '1');
        setFieldValue('packsize', suggestion.packsize || '1');
        setFieldValue('idCategory', findCategoryByName('Medicamento') || '');
        setFieldValue('idForm', findFormByName(suggestion.presentacion) || '');
        setFieldValue('expiration_date', tomorrow.toISOString().split('T')[0]);
        setFieldValue('idLocation', '');
      } else {
        setSelectedMedicine(null);
        reset();
      }
    },
    [setFieldValue, reset, findCategoryByName, findFormByName, formatMedicineDescription]
  );

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const actionToExecute = isEditMode
      ? (data) => updateMedicine(medicine.id, data)
      : createMedicine;

    const result = await handleSubmit(actionToExecute);
    //console.log(result, 'handleFormSubmit', formData);
    if (result.success) {
      toast.success(
        result.message || `✅ Medicina ${isEditMode ? 'actualizada' : 'creada'} correctamente`
      );
      setSubmitSuccess(true);
      if (!isEditMode) {
        reset();
        setSelectedMedicine(null);
      }
    } else {
      if (result.errors) {
        toast.error('Por favor, corrige los errores en el formulario.');
        setErrors(result.errors);
      } else {
        toast.error(result.error || '❌ Ocurrió un error inesperado.');
      }
      setSubmitSuccess(false);
    }
  };

  // OCR Handlers (solo para modo creación)
  const handleOcrStart = () => setIsOcrLoading(true);
  const handleOcrSuccess = async (data) => {
    setIsOcrLoading(false);
    setOcrResult(data);
    try {
      const response = await fetch(
        `/api/gemini/medicines/suggestions?q=${encodeURIComponent(data.text)}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch medicine suggestions');
      }
      const result = await response.json();
      const suggestion = result.suggestions?.[0];
      if (suggestion) {
        handleMedicineSelected(suggestion);
      }
    } catch (error) {
      //console.error('Error fetching suggestions from OCR text:', error);
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
        title={isEditMode ? DICTIONARY_TITLE.edit : DICTIONARY_TITLE.create}
        subtitle={isEditMode ? DICTIONARY_TITLE.editSubtitle : DICTIONARY_TITLE.createSubtitle}
        maxWidth="4xl"
      >
        <form onSubmit={handleFormSubmit}>
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 2 }}>
            {!isEditMode && (
              <ResponsiveField span={{ sm: 1, md: 2, lg: 2 }}>
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
                    Texto escaneado: &quot;{ocrResult.text.substring(0, 50)}...&quot;
                  </p>
                )}
              </ResponsiveField>
            )}

            <ResponsiveField span={{ sm: 1, md: 2, lg: 2 }}>
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
                error={touched.name && errors.name}
                disabled={isEditMode} // Deshabilitado en modo edición para evitar cambios en el nombre buscado
              />
            </ResponsiveField>

            {/* Resto de los campos del formulario... */}
            <ResponsiveField span={{ sm: 1, md: 2, lg: 2 }}>
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
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
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
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
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
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
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
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
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
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
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
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
              <FormInput
                label="Fecha de caducidad"
                name="expiration_date"
                type="date"
                required
                min={!isEditMode ? new Date().toISOString().split('T')[0] : null}
                value={formData.expiration_date}
                onChange={handleChange}
                error={touched.expiration_date && errors.expiration_date}
                onBlur={handleBlur}
                placeholder="Fecha de caducidad"
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
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
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
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
                  loadingText={isEditMode ? 'Actualizando...' : 'Guardando...'}
                >
                  {isEditMode ? 'Actualizar' : 'Guardar'}
                </SubmitButton>
              </FooterForm>
            </ResponsiveField>
          </ResponsiveGrid>
        </form>
      </ResponsiveFormWrapper>
    </>
  );
}
