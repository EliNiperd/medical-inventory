import { fetchFilteredCategories } from "@/app/dashboard/category/actions";
import ModularCategoryTable from "@/app/ui/components/tables/CategoriesResponsiveTable";

export default async function CategoriesTableWrapper({ query, page, limit, sort, order }) {
    // Fetch de datos en el servidor
    const categories = await fetchFilteredCategories(query, page, limit, sort, order);
    return (
        <ModularCategoryTable
            categories={categories}
            loading={false}
        />
    );
}