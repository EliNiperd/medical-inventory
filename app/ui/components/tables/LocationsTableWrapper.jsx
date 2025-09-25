import { fetchFilteredLocations } from '@/app/dashboard/location/actions';
import ModularLocationTable from '@/app/ui/components/tables/LocationsResponsiveTable';

export default async function LocationsTableWrapper({ query, page, limit, sort, order }) {
  // Fetch de datos en el servidor
  const locations = await fetchFilteredLocations(query, page, limit, sort, order);
  return <ModularLocationTable locations={locations} loading={false} />;
}
