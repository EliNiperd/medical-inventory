import { Suspense } from 'react';
import UsersTableWrapper from '@/app/ui/components/tables/UsersTableWrapper';
import UsersResponsiveTable from '@/app/ui/components/tables/UsersResponsiveTable';
import { CreateButton } from '@/app/ui/components/tables/table-actions';

// Componente de loading
function UsersTableSkeleton() {
  return <UsersResponsiveTable users={[]} loading={true} />;
}

export default function TableUsersPage({ searchParams }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Usuarios
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Gestiona los usuarios del sistema
            </p>
          </div>

          <div className="mt-4 sm:mt-0">
            <CreateButton basePath="user" label="Crear Usuario" />
          </div>
        </div>
      </div>

      {/* Tabla con Suspense */}
      <Suspense
        key={JSON.stringify(searchParams)} // Re-suspense cuando cambien los parámetros
        fallback={<UsersTableSkeleton />}
      >
        <UsersTableWrapper
          query={searchParams?.query || ''}
          page={Number(searchParams?.page) || 1}
          limit={Number(searchParams?.limit) || 10}
          sort={searchParams?.sort || 'user_name_full'}
          order={searchParams?.order || 'asc'}
        />
      </Suspense>

      {/* Footer info */}
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
        <p>
          💡 <strong>Tip:</strong> Usa la búsqueda para filtrar usuarios en tiempo real.
        </p>
      </div>
    </div>
  );
}
