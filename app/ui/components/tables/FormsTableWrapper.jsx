import { fetchFilteredForms } from "@/app/dashboard/form/actions";
import ModularFormTable from "@/app/ui/components/tables/FormsResponsiveTable";

export default async function FormsTableWrapper({ query, page, limit, sort, order }) {
    // Fetch de datos en el servidor
    const forms = await fetchFilteredForms(query, page, limit, sort, order);
    return (
        <ModularFormTable
            forms={forms}
            loading={false}
        />
    );
}