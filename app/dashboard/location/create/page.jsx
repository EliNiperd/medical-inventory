import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/location/create-location';

export default function page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Ubicación', href: '/dashboard/location', active: false },
          {
            label: 'Crear Ubicación',
            href: '/dashboard/location/create',
            active: true,
          },
        ]}
      ></Breadcrumbs>
      <Form />
    </main>
  );
}
