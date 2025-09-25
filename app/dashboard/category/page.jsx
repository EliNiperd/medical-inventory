import TableCategory from '@/app/ui/category/table-category';

const mainCategory = ({
  searchParams = {
    query: '',
    page: '1',
    limit: '10',
    sort: 'name',
    order: 'asc',
  },
}) => {
  const query = searchParams?.query?.toString() || '';

  return (
    <div className="w-full">
      <TableCategory query={query} />
    </div>
  );
};
export default mainCategory;
