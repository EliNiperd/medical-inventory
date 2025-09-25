import { fetchFilteredUsers } from '@/app/dashboard/user/actions';
import UsersResponsiveTable from '@/app/ui/components/tables/UsersResponsiveTable'; // El Client Component que acabamos de crear

// ✅ Este es un Server Component que solo pasa datos
export default async function UsersTableWrapper({ query, page, limit, sort, order }) {
  // Fetch de datos en el servidor
  const users = await fetchFilteredUsers(query, page, limit, sort, order);

  // Solo pasar datos serializables, NO funciones
  return <UsersResponsiveTable users={users} loading={false} />;
}

// HOW TO USE -> ejemplo de uso
// Para usar en tu página:
// import UsersTableWrapper from '@/components/tables/UsersTableWrapper';
//
// export default function UsersPage({ searchParams }) {
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Usuarios</h1>
//       <UsersTableWrapper
//         query={searchParams?.query || ''}
//         page={Number(searchParams?.page) || 1}
//         limit={Number(searchParams?.limit) || 10}
//         sort={searchParams?.sort || 'user_name_full'}
//         order={searchParams?.order || 'asc'}
//       />
//     </div>
//   );
// }
