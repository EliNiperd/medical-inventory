import { CreateCategory } from "@/app/ui/category/button-category";
import TableCategory from "@/app/ui/category/table-category";

const mainCategory = ({
    searchParams = {
        query: "",
        page: "1",
        limit: "10",
        sort: "name",
        order: "asc",
    },
}) => {
    const query = searchParams?.query?.toString() || "";
    const mainCategory = searchParams?.page?.toString() || "1";

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl">Presentación </h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                {/*<Search placeholder="Search medicine..."></Search>*/}
                <CreateCategory />
            </div>
            {/*<Suspense key={query} fullback={<MedicineTableSkeleton />}>*/}
            <TableCategory query={query} />
            {/*</Suspense>*/}
        </div>
    );
};
export default mainCategory;