import Breadcrumbs from "@/app/ui/breadcrumbs";
import Form from "@/app/ui/medicine/edit-medicine";
import { fetchCategorys } from "@/app/dashboard/category/actions";
import { fetchForms } from "@/app/dashboard/form/actions";
import { fetchLocations } from "@/app/dashboard/location/actions";
import { fetchMedicineById } from "@/app/dashboard/medicine/actions";

export default async function Page({ params }) {
  const id = params.id;

  const [medicine, categories, forms, locations] = await Promise.all([
    fetchMedicineById(id),
    fetchCategorys(),
    fetchForms(),
    fetchLocations(),
  ]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Medicine", href: "/dashboard/medicine", active: false },
          {
            label: "Editar Medicamento",
            href: `/dashboard/medicine/${id}/edit`,
            active: true,
          },
        ]}
      ></Breadcrumbs>
      <Form
        medicine={medicine}
        categorys={categories}
        forms={forms}
        locations={locations}
      />
    </main>
  );
}
