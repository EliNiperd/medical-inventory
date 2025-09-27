import { fetchFilteredMedicines } from '@/app/dashboard/medicine/actions';
import MedicineResponsiveTable from '@/app/ui/components/tables/MedicinesResponsiveTable';

export default async function MedicinesTableWrapper({ query, page, limit, sort, order }) {
  // Fetch de datos en el servidor
  const medicines = await fetchFilteredMedicines(query, page, limit, sort, order);
  return <MedicineResponsiveTable medicines={medicines} loading={false} />;
}
