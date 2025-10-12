'use client';

import { useMemo } from 'react';
import { BeakerIcon } from '@heroicons/react/24/outline';
import { DeleteButton } from '@/app/ui/components/tables/button-delete';
import { deleteMedicine } from '@/app/dashboard/medicine/actions';

// Importar el sistema modular para la tabla
import ResponsiveTable, {
  TableSearch,
  DesktopTable,
  TabletTable,
  MobileCards,
  TableStats,
} from '@/app/ui/components/responsive-table/responsible-table';
import { UpdateMedicine } from '../../medicine/button-medicine';

const DICTIONARY_TITLE = {
  nameSingular: 'Medicina',
  namePlural: 'Medicinas',
};

// ✅ Definir columnas (se reutiliza en todas las vistas)
function useMedicineColumns() {
  return useMemo(
    () => [
      {
        key: 'name_medicine',
        header: 'Nombre',
        primary: true,
        sortable: true,
        render: (value) => (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <BeakerIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'form_name',
        header: 'Forma/Tipo',
        sortable: true,
        showOnTablet: true,
        render: (value) => (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{value}</span>
          </div>
        ),
      },
      /*{
        key: 'quantity',
        header: 'Cantidad',
        sortable: true,
        showOnTablet: true,
        render: (value) => (
          <div className="flex items-center space-x-2 ">
            <span className="text-sm text-gray-500 dark:text-gray-400">{value}</span>
          </div>
        ),
      },*/
      /*{
        key: 'packsize',
        header: 'Cant. por envase',
        sortable: true,
        showOnTablet: true,
        render: (value) => (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{value}</span>
          </div>
        ),
      },*/
      {
        key: 'expiration_date',
        header: 'Caducidad',
        sortable: true,
        showOnTablet: true,
        render: (value) => (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {value ? new Date(value).toLocaleDateString('es-MX') : 'N/D'}
            </span>
          </div>
        ),
      },
      {
        key: 'location_name',
        header: 'Ubicación',
        sortable: true,
        showOnTablet: true,
        render: (value) => (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
          </div>
        ),
      },
      {
        key: 'quantity_on_hans',
        header: 'Total',
        sortable: true,
        showOnTablet: true,
        render: (value) => (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
          </div>
        ),
      },
      {
        key: 'actions',
        header: 'Acciones',
        render: (_, row) => (
          <div className="flex items-center space-x-2">
            <UpdateMedicine id={row.id} />
            <DeleteButton
              deleteAction={deleteMedicine}
              id={row.id}
              itemName={row.name_medicine}
              itemType="Medicina"
            />
          </div>
        ),
      },
    ],
    []
  );
}

// ✅ Componente principal
export default function MedicineResponsiveTable({ medicines, loading = false }) {
  const columns = useMedicineColumns();
  //console.log(medicines.medicines);

  return (
    <ResponsiveTable
      data={medicines}
      columns={columns}
      loading={loading}
      searchable={true}
      sortable={true}
      // Ordenamiento inicial por medicine_name, orden descendente
      initialSort={{ key: 'name_medicine', order: 'asc' }}
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
      <MobileCards cardComponent={MedicineMobileCard} />
      {/* Estadísticas */}
      <TableStats className="mt-4" />
    </ResponsiveTable>
  );
}

// ✅ Card personalizado para móvil
function MedicineMobileCard({ data: medicine }) {
  // ⚠️ TODO: revisar si se reutiliza de algún lib general
  const formatDate = (date) => {
    if (!date) return 'N/D';
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {medicine.name_medicine}
          </h3>
        </div>
        <div className="flex items-center space-x-1">
          <UpdateMedicine id={medicine.id} className="w-2 h-2" />
          <DeleteButton
            deleteAction={deleteMedicine}
            id={medicine.id}
            itemName={medicine.name_medicine}
            itemType="Medicina"
            className="w-2 h-2"
          />
        </div>
      </div>
      {/* Información */}
      <div className="space-y-2 ">
        <div className="flex items-center space-x-1 text-sm  ">
          <p className="text-gray-600 dark:text-gray-300 truncate">{medicine.description}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600 dark:text-gray-300 truncate">
            <strong>Ubicación:</strong> {medicine.location_name}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600 dark:text-gray-300 truncate">
            <strong>Caducidad:</strong> {formatDate(medicine.expiration_date)}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600 dark:text-gray-300 ">
            <strong> Cantidad:</strong> {medicine.quantity}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600 dark:text-gray-300 ">
            <strong>Total:</strong> {medicine.quantity_on_hans}
          </span>
        </div>
      </div>
    </div>
  );
}
