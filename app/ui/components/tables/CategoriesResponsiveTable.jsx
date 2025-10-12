'use client';

import { useMemo } from 'react';
import { SquaresPlusIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { UpdateCategory } from '@/app/ui/category/button-category';
import { DeleteButton } from '@/app/ui/components/tables/button-delete';
import { deleteCategory } from '@/app/dashboard/category/actions';

// Importar el sistema modular para la tabla
import ResponsiveTable, {
  TableSearch,
  DesktopTable,
  TabletTable,
  MobileCards,
  TableStats,
} from '@/app/ui/components/responsive-table/responsible-table';

const DICTIONARY_TITLE = {
  nameSingular: 'Presentación',
  namePlural: 'Presentaciones',
};

// ✅ DEFINIR COLUMNAS UNA SOLA VEZ (se reutiliza en todas las vistas)
function useCategoryColumns() {
  return useMemo(
    () => [
      {
        key: 'category_name',
        header: 'Presentación',
        primary: true,
        sortable: true,
        render: (value) => (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <SquaresPlusIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'category_description',
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
            <UpdateCategory id_category={row.id_category} />
            <DeleteButton
              deleteAction={deleteCategory}
              id_category={row.id_category}
              itemName={row.category_name}
              itemType="Presentación"
            />
          </div>
        ),
      },
    ],
    []
  );
}

// ✅ CARD PERSONALIZADA PARA MÓVIL (reutilizable)
function CategoryMobileCard({ data: category }) {
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
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {category.category_name}
          </h3>
        </div>

        <div className="flex items-center space-x-1">
          <UpdateCategory id_category={category.id_category} />
          <DeleteButton
            deleteAction={deleteCategory}
            id={category.id_category}
            itemName={category.category_name}
            itemType="Presentación"
          />
        </div>
      </div>

      {/* Información */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600 dark:text-gray-300 truncate">
            {category.category_description}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              {formatDate(category.create_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ COMPONENTE PRINCIPAL (SÚPER SIMPLE)
export default function ModularCategoryTable({ categories, loading = false }) {
  const columns = useCategoryColumns();

  return (
    <ResponsiveTable
      data={categories}
      columns={columns}
      loading={loading}
      searchable={true}
      sortable={true}
      // Ordenamiento inicial por category_name, orden descendente
      initialSort={{ key: 'category_name', order: 'asc' }}
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
      <MobileCards cardComponent={CategoryMobileCard} />
      {/* Estadísticas */}
      <TableStats className="mt-4" />
    </ResponsiveTable>
  );
}

// ✅ EJEMPLO 2: TABLA SIMPLE SIN PERSONALIZACIÓN

// export function SimpleCategoriesTable({ categories, loading }) {
//   const columns = useCategoryColumns();

//   return (
//     <ResponsiveTable data={categories} columns={columns} loading={loading}>
//       <TableSearch />
//       <DesktopTable />
//       <TabletTable />
//       <MobileCards /> {/* Sin cardComponent usa el default */}
//       <TableStats />
//     </ResponsiveTable>
//   );
// }

// ✅ EJEMPLO 3: TABLA CON LAYOUT PERSONALIZADO
// export function CustomLayoutCategoriesTable({ categories, loading }) {
//   const columns = useCategoryColumns();

//   return (
//     <div className="space-y-6">
//       {/* Header personalizado */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
//             Gestión de presentaciones
//           </h2>
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             Administra leees presentaciones del sistema
//           </p>
//         </div>

//         <button className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//           Nueva Presentación
//         </button>
//       </div>
//       {/* Tabla modular */}
//       <ResponsiveTable data={categories} columns={columns} loading={loading}>
//         {/* Búsqueda con estilo personalizado */}
//         <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
//           <TableSearch placeholder="🔍 Buscar categorías..." />
//         </div>
//         {/* Solo mostrar desktop y mobile (saltar tablet) */}
//         <DesktopTable />
//         <MobileCards cardComponent={CategoryMobileCard} />
//         {/* Estadísticas con información adicional */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//           <TableStats />
//         </div>
//       </ResponsiveTable>
//     </div>
//   );
// }

// ✅ EJEMPLO 4: TABLA PARA DIFERENTES TIPOS DE DATOS
// export function GenericTable({ data, columns, title, loading, cardComponent }) {
//   return (
//     <div className="space-y-4">
//       {title && <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>}

//       <ResponsiveTable data={data} columns={columns} loading={loading}>
//         <TableSearch />
//         <DesktopTable />
//         <TabletTable />
//         <MobileCards cardComponent={cardComponent} />
//         <TableStats />
//       </ResponsiveTable>
//     </div>
//   );
// }
