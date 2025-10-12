import { Suspense } from 'react';
import MedicinesTableWrapper from '@/app/ui/components/tables/MedicinesTableWrapper';
import MedicineResponsiveTable from '@/app/ui/components/tables/MedicinesResponsiveTable';
import { CreateMedicine } from '@/app/ui/medicine/button';

function FormTableSkeleton() {
  return <MedicineResponsiveTable medicines={[]} loading={true} />;
}

const pluralName = 'Medicamentos';

export default async function TableMedicine({ searchParams }) {
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
            <CreateMedicine />
          </div>
        </div>
      </div>

      {/* Table con Suspense */}
      <Suspense key={JSON.stringify(searchParams)} fallback={<FormTableSkeleton />}>
        <MedicinesTableWrapper
          query={searchParams?.query || ''}
          page={searchParams?.page || '1'}
          limit={searchParams?.limit || '10'}
          sort={searchParams?.sort || 'name_medicine'}
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
