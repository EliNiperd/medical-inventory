import { CreateMedicine } from '@/app/ui/medicine/button';
import Table from '@/app/ui/medicine/table';
import Search from '@/app/ui/search';
import { MedicineTableSkeleton } from '@/app/ui/medicine/skeletons';
import { Suspense } from 'react';

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
  const page = searchParams?.page?.toString() || '1';

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Medicines</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search medicine..."></Search>
        <CreateMedicine />
      </div>
      <Suspense key={query} fullback={<MedicineTableSkeleton />}>
        <Table query={query} />
      </Suspense>
    </div>
  );
};

export default page;
