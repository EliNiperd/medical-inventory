import { fetchFilteredUsers } from "@/app/dashboard/admin/user/actions";
import { DeleteUser, UpdateUser } from "@/app/ui/user/button";

export default async function TableUsers({ query, page, limit, sort, order }) {
  const users = await fetchFilteredUsers(query, page, limit, sort, order);
  //console.log(medicines);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-m-full text-gray-900 md:table">
            <thead className="rounded-lg text-sm font-normal text-center">
              <tr>
                <th scope="col" className="px-4 py-5 font-sm font normal">
                  Nombre Cumpleto
                </th>
                {/*<th scope="col" className="px-4 py-5 font-sm font normal">
                  Descripción
                </th>*/}
                <th scope="col" className="px-4 py-5 font-sm font normal">
                  Email
                </th>
                <th scope="col" className="px-4 py-5 font-sm font normal">
                  Rol(es)
                </th>
                <th scope="col" className="px-4 py-5 font-sm font normal">
                  Fecha Alta
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit/Delete</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200  rounded-lg">
              {users.map((user) => (
                <tr
                  key={user.id_user}
                  className="divide-x divide-gray-200  text-center md:table-row hover:bg-gray-50"
                >
                  <td className="px-4 py-4 text-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.user_name_full}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-500">Rol Pendiente</p>
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-500">
                      {user.create_at?.toLocaleDateString() ?? "N/D"}
                    </p>
                  </td>
                  <td className="px-4 py-4 flex items-center space-x-4">
                    <UpdateUser id={user.id_user} />
                    <DeleteUser id={user.id_user}></DeleteUser>
                  </td>
                </tr>
              )) ?? (
                <tr>
                  <td>
                    <p>No hay usuarios</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
