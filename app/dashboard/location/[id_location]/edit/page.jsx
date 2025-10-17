import Breadcrumbs from '@/app/ui/breadcrumbs';
import LocationForm from '@/app/ui/location/location-form';
import { fetchLocationById } from '@/app/dashboard/location/actions';

async function Page({ params }) {
  const id_location = params.id_location;
  const { location } = await fetchLocationById(id_location);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Ubicaciones', href: '/dashboard/location' },
          {
            label: 'Editar Ubicación',
            href: `/dashboard/location/${id_location}/edit`,
            active: true,
          },
        ]}
      />
      <LocationForm location={location} />
    </main>
  );
}

export default Page;
