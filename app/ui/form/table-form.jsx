import { Suspense } from 'react';
import FormsResponsiveTable from '@/app/ui/components/tables/FormsResponsiveTable';
import { CreateButton } from '@/app/ui/components/tables/table-actions';
import { fetchFilteredForms } from '@/app/dashboard/form/actions';
import ModularFormTable from '@/app/ui/components/tables/FormsResponsiveTable';

function FormTableSkeleton() {
  return <FormsResponsiveTable forms={[]} loading={true} />;
}

const pluralName = 'Formas/Tipos';

export default async function TableForm({ searchParams }) {
  const query = searchParams?.query?.toString() || '';
  const page = parseInt(searchParams?.page?.toString() || '1', 1);
  const limit = parseInt(searchParams?.limit?.toString() || '10', 10);
  const sort = searchParams?.sort?.toString() || 'name_form';
  const order = searchParams?.order?.toString() || 'asc';
  const formsData = await fetchFilteredForms(query, page, limit, sort, order);
  //console.log(formsData);

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
            <CreateButton basePath="form" label="Crear Forma" />
          </div>
        </div>
      </div>

      {/* Table con Suspense*/}
      <Suspense key={JSON.stringify(searchParams)} fallback={<FormTableSkeleton />}>
        <ModularFormTable forms={formsData} loading={false} />
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
