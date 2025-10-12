'use client';

import { useMemo } from 'react';
import { RectangleGroupIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { UpdateButton, DeleteButton } from '@/app/ui/components/tables/table-actions';
import { deleteForm } from '@/app/dashboard/form/actions';

// Importar el sistema modular para la tabla
import ResponsiveTable, {
  TableSearch,
  DesktopTable,
  TabletTable,
  MobileCards,
  TableStats,
} from '@/app/ui/components/responsive-table/responsible-table';

const DICTIONARY_TITLE = {
  nameSingular: 'Forma/Tipo',
  namePlural: 'Formas/Tipos',
};

// ✅ DEFINIR COLUMNAS UNA SOLA VEZ (se reutiliza en todas las vistas)
function useFormColumns() {
  return useMemo(
    () => [
      {
        key: 'form_name',
        header: 'Forma/Tipo',
        primary: true,
        sortable: true,
        render: (value) => (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <RectangleGroupIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'form_description',
        header: 'Descripción',
        sortable: true,
        showOnTablet: true,
        render: (value) => (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{value}</span>
          </div>
        ),
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
        ),
      },
      {
        key: 'actions',
        header: 'Acciones',
        type: 'actions',
        align: 'right',

        render: (_, row) => (
          <div className="flex items-center space-x-2">
            <UpdateButton id={row.id_form} basePath="form" />
            <DeleteButton
              deleteAction={deleteForm}
              id={row.id_form}
              itemName={row.form_name}
              itemType="Forma/Tipo"
            />
          </div>
        ),
      },
    ],
    []
  );
}

// ✅ CARD PERSONALIZADA PARA MÓVIL (reutilizable)
function FormMobileCard({ data: form }) {
  // TODO: revisar si se reutiliza de algún lib general
  const formatDate = (date) => {
    if (!date) return 'N/D';
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{form.form_name}</h3>
        </div>

        <div className="flex items-center space-x-1">
          <UpdateButton id={form.id_form} basePath="form" />
          <DeleteButton
            deleteAction={deleteForm}
            id={form.id_form}
            itemName={form.form_name}
            itemType="Forma/Tipo"
          />
        </div>
      </div>

      {/* Información */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600 dark:text-gray-300 truncate">{form.form_description}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              {formatDate(form.create_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ COMPONENTE PRINCIPAL (SÚPER SIMPLE)
export default function ModularFormTable({ forms, loading = false }) {
  const columns = useFormColumns();

  return (
    <ResponsiveTable
      data={forms}
      columns={columns}
      loading={loading}
      searchable={true}
      sortable={true}
      // Ordenamiento inicial por form_name, orden descendente
      initialSort={{ key: 'form_name', order: 'asc' }}
    >
      {/* Barra de búsqueda */}
      <TableSearch
        placeholder={`Buscar ${String(DICTIONARY_TITLE.namePlural).toLowerCase()} por nombre, descripción...`}
      />
      {/* Vista Desktop */}
      <DesktopTable />
      {/* Vista Tablet */}
      <TabletTable />
      {/* Vista Mobile */}
      <MobileCards cardComponent={FormMobileCard} />
      {/* Estadísticas */}
      <TableStats className="mt-4" />
    </ResponsiveTable>
  );
}

// ✅ EJEMPLO 2: TABLA SIMPLE SIN PERSONALIZACIÓN
export function SimpleFormsTable({ forms, loading }) {
  const columns = useFormColumns();

  return (
    <ResponsiveTable data={forms} columns={columns} loading={loading}>
      <TableSearch />
      <DesktopTable />
      <TabletTable />
      <MobileCards /> {/* Sin cardComponent usa el default */}
      <TableStats />
    </ResponsiveTable>
  );
}
