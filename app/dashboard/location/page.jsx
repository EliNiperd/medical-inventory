//import { CreateLocation } from "@/app/ui/location/button-location";
import TableLocations from '@/app/ui/location/table-location';

const page = ({
  searchParams = {
    query: '',
    page: '1',
    limit: '10',
    sort: 'name',
    order: 'asc',
  },
}) => {
  const query = searchParams?.query?.toString() || '';
  //const page = searchParams?.page?.toString() || "1";

  return (
    <div className="w-full">
      <TableLocations query={query} />
    </div>
  );
};
export default page;
