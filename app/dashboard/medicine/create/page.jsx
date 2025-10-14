import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/medicine/medicine-form';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Medicine', href: '/dashboard/medicine', active: false },
          {
            label: 'Crear Medicamento',
            href: '/dashboard/medicine/create',
            active: true,
          },
        ]}
      ></Breadcrumbs>
      <Form />
    </main>
  );
}
