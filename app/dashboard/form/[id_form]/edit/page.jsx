import Breadcrumbs from '@/app/ui/breadcrumbs';
import FormForm from '@/app/ui/form/form-form';
import { fetchFormById } from '@/app/dashboard/form/actions';

async function Page({ params }) {
  const id_form = parseInt(params.id_form);
  const { form } = await fetchFormById(id_form);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Formas', href: '/dashboard/form' },
          {
            label: 'Editar Forma',
            href: `/dashboard/form/${id_form}/edit`,
            active: true,
          },
        ]}
      />
      <FormForm form={form} />
    </main>
  );
}

export default Page;
