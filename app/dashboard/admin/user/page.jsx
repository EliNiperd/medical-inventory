import { CreateUser } from "@/app/ui/user/button";
import TableUsers from "@/app/ui/user/table-users";

const page = ({
  searchParams = {
    query: "",
    page: "1",
    limit: "10",
    sort: "name",
    order: "asc",
  },
}) => {
  const query = searchParams?.query?.toString() || "";
  const page = searchParams?.page?.toString() || "1";

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Users</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/*<Search placeholder="Search medicine..."></Search>*/}
        <CreateUser />
      </div>
      {/*<Suspense key={query} fullback={<MedicineTableSkeleton />}>*/}
      <TableUsers query={query} />
      {/*</Suspense>*/}
    </div>
  );
};
export default page;
