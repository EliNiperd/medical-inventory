import { fetchFilteredMedicines } from "@/app/dashboard/medicine/actions";
import { DeleteMedicine, UpdateMedicine } from "@/app/ui/medicine/button";

export default async function TableMedicine({
  query,
  page,
  limit,
  sort,
  order,
}) {
  const medicines = await fetchFilteredMedicines(
    query,
    page,
    limit,
    sort,
    order
  );
  //console.log(medicines);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-m-full text-gray-900 md:table">
            <thead className="rounded-lg text-sm font-normal text-center">
              <tr>
                <th scope="col" className="px-4 py-5 font-sm font normal">
                  Nombre
                </th>
                {/*<th scope="col" className="px-4 py-5 font-sm font normal">
                  Descripción
                </th>*/}
                {/* <th scope="col" className="px-4 py-5 font-sm font normal">
                  Tipo
                </th> */}
                <th scope="col" className="px-4 py-5 font-sm font normal">
                  Cont.
                </th>
                <th scope="col" className="px-4 py-5 font-sm font normal">
                  Presentación
                </th>
                <th scope="col" className="px-4 py-5 font-sm font normal">
                  Cant.
                </th>
                <th scope="col" className="px-4 py-5 font-sm font normal">
                  Caducidad
                </th>
                {/* <th scope="col" className="px-4 py-5 font-sm font normal">
                  Reorder
                </th> */}
                <th scope="col" className="px-4 py-5 font-sm font normal">
                  Ubicación
                </th>
                {/* <th scope="col" className="px-4 py-5 font-sm font normal">
                  Precio
                </th> */}
                <th scope="col" className="px-4 py-5 font-sm font normal">
                  Total
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit/Delete</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200  rounded-lg">
              {medicines.length > 0 ? (
                medicines.map((medicine) => (
                  <tr
                    key={medicine.id}
                    className="divide-x divide-gray-200  text-center md:table-row hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 text-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                        <p className="text-sm font-medium text-gray-900">
                          {medicine.name_medicine}
                        </p>
                      </div>
                    </td>
                    {/*<td className="px-4 py-4">
                    <p className="text-sm text-gray-500">
                      {medicine.description}
                    </p>
              </td>*/}
                    {/* <td className="px-4 py-4">
                      <p className="text-sm text-gray-500">
                        {medicine.category_name}
                      </p>
                    </td> */}
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-500">{medicine.quantity}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-500">
                        {medicine.form_name}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-500">{medicine.packsize}</p>
                    </td>
                    <td className="px-4 py-4 items-center">
                      <p className="text-sm font-medium text-gray-900 ">
                        {medicine.expiration_date?.toLocaleDateString() ?? "N/D"}
                      </p>
                    </td>
                    {/* <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {medicine.reorder_point}
                      </p>
                    </td> */}
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {medicine.location_name}
                      </p>
                    </td>
                    {/* <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {medicine.price?.toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }) ?? "N/D"}
                      </p>
                    </td> */}
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {medicine.quantity_on_hans}
                      </p>
                    </td>
                    <td className="px-4 py-4 flex items-center space-x-4">
                      <UpdateMedicine id={medicine.id} />
                      <DeleteMedicine id={medicine.id}></DeleteMedicine>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="py-4 text-center text-gray-500">
                    <p>No hay medicamentos</p>
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
