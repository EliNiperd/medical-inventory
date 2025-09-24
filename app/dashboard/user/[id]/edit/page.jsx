import Breadcrumbs from "@/app/ui/breadcrumbs";
import Form from "@/app/ui/user/edit-user";
import { fetchUserById } from "@/app/dashboard/user/actions";

async function page({ params }) {
  const id = params.id;

  const [user] = await Promise.all([fetchUserById(id)]);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "User", href: "/dashboard/user", active: false },
          {
            label: "Editar Usuario",
            href: `/dashboard/user/${id}/edit`,
            active: true,
          },
        ]}
      ></Breadcrumbs>
      <Form user={user} />
    </main>
  );
}

export default page;
