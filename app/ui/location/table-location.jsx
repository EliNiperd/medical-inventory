import { Suspense } from 'react';
import LocationsTableWrapper from '@/app/ui/components/tables/LocationsTableWrapper';
import LocationsResponsiveTable from '@/app/ui/components/tables/LocationsResponsiveTable';
import { CreateLocation } from '@/app/ui/location/button-location';

function LocationTableSkeleton() {
  return <LocationsResponsiveTable locations={[]} loading={true} />;
}

export default function TableLocationsPage({ searchParams }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Ubicaciones
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Gestiona las ubicaciones del sistema
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <CreateLocation />
          </div>
        </div>
      </div>

      {/* Table con Suspense*/}
      <Suspense key={JSON.stringify(searchParams)} fallback={<LocationTableSkeleton />}>
        <LocationsTableWrapper
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
          💡 <strong>Tip:</strong> Usa la búsqueda para filtrar ubicaciones en tiempo real.
        </p>
      </div>
    </div>
  );
}

/** Versión antigua */
/*
export default async function TableLocations({ query, page, limit, sort, order }) {
    const locations = await fetchFilteredLocations(query, page, limit, sort, order);
    //console.log(locations);
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <table className="hidden min-m-full text-gray-900 md:table">
                        <thead className="rounded-lg text-sm font-normal text-center border-b border-gray-200">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-sm font normal">
                                    Ubicación
                                </th>
                                <th scope="col" className="px-4 py-5 font-sm font normal">
                                    Descripción
                                </th>
                                <th scope="col" className="px-4 py-5 font-sm font normal">
                                    Fecha Alta
                                </th>
                                <th scope="col" className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Edit/Delete</span>
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200 rounded-lg">
                            {locations.length > 0 ? (
                                locations.map((location) => (
                                    <tr
                                        key={location.id_location}
                                        className="divide-x divide-gray-200 text-center md:table-row hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-4 text-nowrap">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {location.location_name}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm text-gray-500">{location.location_description}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm text-gray-500">
                                                {location.created_at?.toLocaleDateString() ?? "N/D"}
                                            </p>
                                        </td>
                                        <td className="px-4 py-4 flex items-center space-x-4">
                                            <UpdateLocation id_location={location.id_location} />
                                            <DeleteLocation id_location={location.id_location} location_name={location.location_name} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center text-gray-500">
                                        <p>No hay ubicaciones</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}
*/
