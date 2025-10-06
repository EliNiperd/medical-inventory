'use client';

import {
  DocumentTextIcon,
  QueueListIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CalculatorIcon,
  InboxStackIcon,
  SwatchIcon,
  GlobeAmericasIcon,
  SquaresPlusIcon,
  RectangleGroupIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Button from '@/app/ui/button';
import { updateMedicine } from '@/app/dashboard/medicine/actions';
import ResponsiveFormWrapper, {
  ResponsiveGrid,
  ResponsiveField,
} from '@/app/ui/components/form/responsive-form-wrapper';
import FooterForm from '@/app/ui/components/form/footer-form';
import FormInput from '@/app/ui/components/form/form-input';
import { SubmitButton } from '../components/form/button-form';
import { useForm, useSchemaValidation } from '@/app/hooks/useFormValidation';

export default function Form({ medicine, categories, forms, locations }) {
  //const { updateMedicineWithId } = medicineEditForm;
  //// 4️⃣ Importar las reglas de validación
  const VALIDATION_RULES = useSchemaValidation('medicine');

  // 1️⃣ Diccionario de títulos para el formulario
  const DICTIONARY_TITLE = {
    nameSingular: 'Medicina',
    namePlural: 'Medicinas',
  };

  // 2️⃣ Inicializar el estado con los datos del formulario
  // { formData, errors, handleChange, handleBlur, isValid, handleServerAction }
  const form = useForm(
    {
      name: medicine.name,
      description: medicine.description,
      idCategory: medicine.idCategory,
      idForm: medicine.idForm,
      packsize: medicine.packsize,
      reorder_point: medicine.reorder_point,
      idLocation: medicine.idLocation,
      price: medicine.price,
      quantity: medicine.quantity,
      expiration_date: medicine.expiration_date.toISOString().split('T')[0],
    },
    VALIDATION_RULES
  );

  // 3️⃣ Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('✅ Enviando formulario:', form.formData);
    // Declarar la referencia de la Server Action, para pasarla a handleServerAction
    const updateMedicineWithId = (formData) => updateMedicine(medicine.id, formData);
    //console.log('✅ Enviando formulario:', updateMedicineWithId);
    // Llama a handleServerAction, pasando la Server Action correspondiente
    const response = await form.handleServerAction(updateMedicineWithId, {
      onSuccess: () => {}, // console.log('Usuario creado!'), // 🔍 Solo para Debuggear
      onError: (error) => console.error(`Error al crear ${DICTIONARY_TITLE.nameSingular}:`, error),
    });
    // console.log('✅ Formulario enviado!', response);
  };

  const expirationDate = medicine.expiration_date.toISOString().split('T')[0];
  return (
    <>
      <ResponsiveFormWrapper
        title={`Editar ${DICTIONARY_TITLE.nameSingular}`}
        subtitle={`Ingresa la información de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
        maxWidth="4xl"
      >
        <form onSubmit={handleSubmit}>
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 2 }}>
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FormInput
                name="name"
                label="Nombre Comercial"
                type="text"
                defaultValue={medicine.name}
                placeholder="Ingrese el nombre del medicamento"
                required
                icon={BeakerIcon}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.name}
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FormInput
                name="description"
                label="Descripción"
                type="text"
                defaultValue={medicine.description}
                placeholder="Ingrese la descripción del medicamento (sustancia(s) activa(s), uso, etc.)"
                required
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.description}
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
              <FormInput
                name="idCategory"
                label="Categoría"
                type="select"
                icon={SquaresPlusIcon}
                options={categories}
                optionValueKey="id_category"
                optionLabelKey="category_name"
                defaultValue={medicine.idCategory}
                required
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.idCategory}
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
              <FormInput
                name="idForm"
                label="Forma"
                type="select"
                icon={RectangleGroupIcon}
                options={forms}
                optionValueKey="id_form"
                optionLabelKey="form_name"
                defaultValue={medicine.idForm}
                required
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.idForm}
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
              <FormInput
                name="quantity"
                label="Cantidad"
                type="number"
                defaultValue={medicine.quantity}
                required
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.quantity}
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
              <FormInput
                name="packsize"
                label="Paquetes (Unidades)"
                type="number"
                defaultValue={medicine.packsize}
                required
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.packsize}
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
              <FormInput
                name="reorder_point"
                label="Punto de Reorden"
                type="number"
                defaultValue={medicine.reorder_point}
                required
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.reorder_point}
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
              <FormInput
                name="expiration_date"
                label="Fecha de Vencimiento"
                type="date"
                defaultValue={expirationDate}
                required
                icon={CalendarIcon}
                placeholder="Ingrese la fecha de vencimiento"
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.expiration_date}
              ></FormInput>
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
              <FormInput
                name="idLocation"
                label="Ubicación"
                type="select"
                icon={GlobeAmericasIcon}
                options={locations}
                optionValueKey="id_location"
                optionLabelKey="location_name"
                defaultValue={medicine.idLocation}
                required
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.idLocation}
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
              <FormInput
                name="price"
                label="Precio"
                type="number"
                defaultValue={medicine.price}
                required
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.price}
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FooterForm>
                <Link href="/dashboard/medicine" className="btn-form-cancel">
                  Cancelar
                </Link>
                <SubmitButton
                  // Se recupera el estado 'isPending' del formulario, para desactivar el botón mientras se envía el formulario
                  isPending={form.isPending}
                  // El botón se deshabilita si el formulario no es válido o está en 'pending'
                  disabled={!form.isValid || form.isPending}
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
