import { fetchFilteredForms } from "@/app/dashboard/form/actions";
import { UpdateForm } from "@/app/ui/form/button-form";
import { DeleteButtonForm } from "@/app/ui/form/button-delete";

export default async function TableForm({ query, page, limit, sort, order }) {
    const forms = await fetchFilteredForms(query, page, limit, sort, order);
    //console.log(forms);
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <table className="hidden min-m-full text-gray-900 md:table">
                        <thead className="rounded-lg text-sm font-normal text-center border-b border-gray-200">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-sm font normal">
                                    Forma
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
                            {forms.length > 0 ? (
                                forms.map((form) => (
                                    <tr
                                        key={form.id_form}
                                        className="divide-x divide-gray-200  text-center md:table-row hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-4 text-nowrap">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {form.form_name}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm text-gray-500">{form.form_description}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm text-gray-500">
                                                {form.create_at?.toLocaleDateString() ?? "N/D"}
                                            </p>
                                        </td>
                                        <td className="px-4 py-4 flex items-center space-x-4">
                                            <UpdateForm id_form={form.id_form} />
                                            <DeleteButtonForm id_form={form.id_form} form_name={form.form_name}></DeleteButtonForm>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr >
                                    <td colSpan="4" className="px-4 py-4 text-center">
                                        <p>No hay formas</p>
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
