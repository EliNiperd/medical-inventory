import Breadcrumbs from "@/app/ui/breadcrumbs";
import FormLocationEdit from "@/app/ui/location/edit-location";
import { fetchLocationById } from "@/app/dashboard/location/actions";

async function page({ params }) {
  const id_location = params.id_location;

  const [location] = await Promise.all([fetchLocationById(id_location)]);
  //console.log(location);
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Ubicación", href: "/dashboard/location", active: false },
          {
            label: "Editar Ubicación",
            href: `/dashboard/location/${id_location}/edit`,
            active: true,
          },
        ]}
      ></Breadcrumbs>
      <FormLocationEdit location={location} />
    </main>
  );
}

export default page;
