import { Suspense } from 'react';
import CategoriesTableWrapper from '@/app/ui/components/tables/CategoriesTableWrapper';
import CategoriesResponsiveTable from '@/app/ui/components/tables/CategoriesResponsiveTable';
import { CreateCategory } from '@/app/ui/category/button-category';

function CategoryTableSkeleton() {
  return <CategoriesResponsiveTable categories={[]} loading={true} />;
}

const pluralName = 'Presentaciones';

export default async function TableCategory({ searchParams }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {pluralName}
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {`Gestiona las ${pluralName} del sistema`}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <CreateCategory />
          </div>
        </div>
      </div>

      {/* Table con Suspense*/}
      <Suspense key={JSON.stringify(searchParams)} fallback={<CategoryTableSkeleton />}>
        <CategoriesTableWrapper
          query={searchParams?.query || ''}
          page={searchParams?.page || '1'}
          limit={searchParams?.limit || '10'}
          sort={searchParams?.sort || 'name_location'}
          order={searchParams?.order || 'asc'}
        />
      </Suspense>

      {/* Footer info */}
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
        <p>
          💡 <strong>Tip:</strong>{' '}
          {`Usa la búsqueda para filtrar ${pluralName.toLowerCase()} en tiempo real.`}
        </p>
      </div>
    </div>
  );
}
