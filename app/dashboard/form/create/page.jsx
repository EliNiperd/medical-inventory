import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/form/create-form';

export default function page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Forma', href: '/dashboard/form', active: false },
          {
            label: 'Crear Forma',
            href: '/dashboard/form/create',
            active: true,
          },
        ]}
      ></Breadcrumbs>
      <Form />
    </main>
  );
}
