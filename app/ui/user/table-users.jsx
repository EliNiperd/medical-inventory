import { Suspense } from 'react';
import UsersTableWrapper from '@/app/ui/components/tables/UsersTableWrapper';
import UsersResponsiveTable from '@/app/ui/components/tables/UsersResponsiveTable';
import { CreateUser } from '@/app/ui/user/button';

// Componente de loading
function UsersTableSkeleton() {
  return <UsersResponsiveTable users={[]} loading={true} />;
}

// Componente de error
/* TODO: este es un componente de error personalizado, utilizado en UsersPageWithErrorBoundary */
/*
function UsersTableError() {
  return (
    <div className="text-center py-12">
      <div className="text-red-500 mb-4">
        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        Error al cargar usuarios
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        No se pudieron cargar los usuarios. Por favor, intenta de nuevo.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Reintentar
      </button>
    </div>
  );
}
*/


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
            {/*TODO: revisar si hay que hacer referencia al botón genérico o crear uno especial*/}
            {/*
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm 
            font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            href="/dashboard/user/create"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo Usuario
            </button>
            */}
            <CreateUser />
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
        <p>💡 <strong>Tip:</strong> Usa la búsqueda para filtrar usuarios en tiempo real.</p>
      </div>
    </div>
  );
}

// O si prefieres manejar el error boundary manualmente:
/*
import { ErrorBoundary } from 'react-error-boundary';

export function UsersPageWithErrorBoundary({ searchParams }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ErrorBoundary
        FallbackComponent={UsersTableError}
        onError={(error) => {
          console.error('Users table error:', error);
          // Aquí podrías enviar el error a un servicio de logging
        }}
      >
        <Suspense fallback={<UsersTableSkeleton />}>
          <UsersTableWrapper {...searchParams} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
  */