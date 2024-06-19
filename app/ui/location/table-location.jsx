import { fetchFilteredLocations } from "@/app/dashboard/location/actions";
import { UpdateLocation } from "@/app/ui/location/button-location";
import { DeleteLocation } from "@/app/ui/location/button-delete";

export default async function TableLocations({ query, page, limit, sort, order }) {
    const locations = await fetchFilteredLocations(query, page, limit, sort, order);
    //console.log(locations);
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <table className="hidden min-m-full text-gray-900 md:table">
                        <thead className="rounded-lg text-sm font-normal text-center">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-sm font normal">
                                    Ubicación
                                </th>
                                <th scope="col" className="px-4 py-5 font-sm font normal">
                                    Descripción
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
                            {locations.map((location) => (
                                <tr
                                    key={location.id_location}
                                    className="divide-x divide-gray-200  text-center md:table-row hover:bg-gray-50"
                                >
                                    <td className="px-4 py-4 text-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {location.location_name}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="text-sm text-gray-500">{location.location_description}</p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="text-sm text-gray-500">
                                            {location.created_at?.toLocaleDateString() ?? "N/D"}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4 flex items-center space-x-4">
                                        <UpdateLocation id_location={location.id_location} />
                                        <DeleteLocation id_location={location.id_location} location_name={location.location_name}></DeleteLocation>
                                    </td>
                                </tr>
                            )) ?? (
                                    <tr>
                                        <td>
                                            <p>No hay ubicaciones</p>
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
