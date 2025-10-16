import { Suspense } from 'react';
import { CreateButton } from '@/app/ui/components/tables/table-actions';
import { fetchFilteredCategories } from '@/app/dashboard/category/actions';
import ModularCategoryTable from '@/app/ui/components/tables/CategoriesResponsiveTable';

function CategoryTableSkeleton() {
  return <ModularCategoryTable categories={[]} loading={true} />;
}

const pluralName = 'Presentaciones';

export default async function TableCategory({ searchParams }) {
  const query = searchParams?.query?.toString() || '';
  const page = parseInt(searchParams?.page?.toString() || '1', 10);
  const limit = parseInt(searchParams?.limit?.toString() || '10', 10);
  const sort = searchParams?.sort?.toString() || 'name_category';
  const order = searchParams?.order?.toString() || 'desc';
  const categories = await fetchFilteredCategories(query, page, limit, sort, order);
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
            <CreateButton basePath="category" label="Crear Presentación" />
          </div>
        </div>
      </div>

      {/* Table con Suspense*/}
      <Suspense key={JSON.stringify(searchParams)} fallback={<CategoryTableSkeleton />}>
        <ModularCategoryTable categories={categories.categories} loading={false} />
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
