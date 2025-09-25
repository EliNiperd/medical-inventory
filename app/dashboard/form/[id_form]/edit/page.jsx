import Breadcrumbs from '@/app/ui/breadcrumbs';
import Form from '@/app/ui/form/edit-form';
import { fetchFormById } from '@/app/dashboard/form/actions';

async function page({ params }) {
  const id_form = params.id_form;

  const [form] = await Promise.all([fetchFormById(id_form)]);
  //console.log(location);
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Formas', href: '/dashboard/form', active: false },
          {
            label: 'Editar Forma',
            href: `/dashboard/form/${id_form}/edit`,
            active: true,
          },
        ]}
      ></Breadcrumbs>
      <Form form={form} />
    </main>
  );
}

export default page;
