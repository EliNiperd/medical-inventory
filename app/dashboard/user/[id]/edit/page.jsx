import Breadcrumbs from '@/app/ui/breadcrumbs';
import UserForm from '@/app/ui/user/user-form';
import { fetchUserById } from '@/app/dashboard/user/actions';

async function Page({ params }) {
  const id = params.id;

  const { user } = await fetchUserById(id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Usuarios', href: '/dashboard/user' },
          {
            label: 'Editar Usuario',
            href: `/dashboard/user/${id}/edit`,
            active: true,
          },
        ]}
      />
      <UserForm user={user} />
    </main>
  );
}

export default Page;
