import Breadcrumbs from '@/app/ui/breadcrumbs';
import Category from '@/app/ui/category/edit-category';
import { fetchCategoryById } from '@/app/dashboard/category/actions';

async function page({ params }) {
  const id_category = params.id_category;

  const [category] = await Promise.all([fetchCategoryById(id_category)]);
  //console.log(location);
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Presentaciones', href: '/dashboard/category', active: false },
          {
            label: 'Editar presentación',
            href: `/dashboard/category/${id_category}/edit`,
            active: true,
          },
        ]}
      ></Breadcrumbs>
      <Category category={category} />
    </main>
  );
}

export default page;
