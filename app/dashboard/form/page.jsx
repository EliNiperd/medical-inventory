import { CreateForm } from "@/app/ui/form/button-form";
import TableForms from "@/app/ui/form/table-form";

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
                <h1 className="text-2xl">Formas </h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                {/*<Search placeholder="Search medicine..."></Search>*/}
                <CreateForm />
            </div>
            {/*<Suspense key={query} fullback={<MedicineTableSkeleton />}>*/}
            <TableForms query={query} />
            {/*</Suspense>*/}
        </div>
    );
};
export default page;
