import TableMedicine from '@/app/ui/medicine/table-medicine';

const page = ({
  searchParams = {
    query: '',
    page: '1',
    limit: '10',
    sort: 'name_medicine',
    order: 'asc',
  },
}) => {
  const query = searchParams?.query?.toString() || '';
  //const page = searchParams?.page?.toString() || '1';

  return (
    <div className="w-full">
      <TableMedicine query={query} />
    </div>
  );
};

export default page;
