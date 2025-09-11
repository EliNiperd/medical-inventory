import Breadcrumbs from "@/app/ui/breadcrumbs";
import Form from "@/app/ui/medicine/create-medicine";
import { fetchCategorys } from "@/app/dashboard/category/actions";
import { fetchForms } from "@/app/dashboard/form/actions";
import { fetchLocations } from "@/app/dashboard/location/actions";

const categories = await fetchCategorys();
const forms = await fetchForms();
const locations = await fetchLocations();
//console.log("errores");
//console.log(forms);

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Medicine", href: "/dashboard/medicine", active: false },
          {
            label: "Crear Medicamento",
            href: "/dashboard/medicine/create",
            active: true,
          },
        ]}
      ></Breadcrumbs>
      <Form categorys={categories} forms={forms} locations={locations} />
    </main>
  );
}
