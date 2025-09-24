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

    return (
        <div className="w-full">
            <TableForms query={query} />
        </div>
    );
};
export default page;
