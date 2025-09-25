import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/user/create-user';

export default function page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'User', href: '/dashboard/user', active: false },
          {
            label: 'Crear Usuario',
            href: '/dashboard/user/create',
            active: true,
          },
        ]}
      ></Breadcrumbs>
      <Form />
    </main>
  );
}
