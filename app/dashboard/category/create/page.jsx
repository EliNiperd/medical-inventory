import Breadcrumbs from "@/app/ui/breadcrumbs";
import CreateCategory from "@/app/ui/category/create-category";

export default function page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: "Presentación", href: "/dashboard/category", active: false },
                    {
                        label: "Crear Presentación",
                        href: "/dashboard/category/create",
                        active: true,
                    },
                ]}
            ></Breadcrumbs>
            <CreateCategory />
        </main>
    );
}
