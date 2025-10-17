import Breadcrumbs from '@/app/ui/breadcrumbs';
import CategoryForm from '@/app/ui/category/category-form';
import { fetchCategoryById } from '@/app/dashboard/category/actions';

async function Page({ params }) {
  const id_category = params.id_category;
  const { category } = await fetchCategoryById(id_category);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Categorías', href: '/dashboard/category' },
          {
            label: 'Editar Categoría',
            href: `/dashboard/category/${id_category}/edit`,
            active: true,
          },
        ]}
      />
      <CategoryForm category={category} />
    </main>
  );
}

export default Page;
