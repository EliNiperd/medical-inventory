import { Suspense } from 'react';
import ModularMedicineTable from '@/app/ui/components/tables/MedicinesResponsiveTable';
import { CreateButton } from '@/app/ui/components/tables/table-actions';
import { fetchFilteredMedicines } from '@/app/dashboard/medicine/actions';

function FormTableSkeleton() {
  return <ModularMedicineTable medicines={[]} loading={true} />;
}

const pluralName = 'Medicamentos';

export default async function TableMedicine({ searchParams }) {
  const query = searchParams?.query?.toString() || '';
  const page = parseInt(searchParams?.page?.toString() || '1', 1);
  const limit = parseInt(searchParams?.limit?.toString() || '10', 10);
  const sort = searchParams?.sort?.toString() || 'name_medicine';
  const order = searchParams?.order?.toString() || 'asc';
  //
  const medicines = await fetchFilteredMedicines(query, page, limit, sort, order);
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
              Gestiona los {pluralName} del sistema
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <CreateButton basePath="medicine" label="Crear Medicina" />
          </div>
        </div>
      </div>

      {/* Table con Suspense */}
      <Suspense key={JSON.stringify(searchParams)} fallback={<FormTableSkeleton />}>
        <ModularMedicineTable medicines={medicines.medicines} loading={false} />
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
