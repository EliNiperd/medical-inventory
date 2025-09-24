import { Suspense } from "react";
import FormsTableWrapper from "@/app/ui/components/tables/FormsTableWrapper";
import FormsResponsiveTable from "@/app/ui/components/tables/FormsResponsiveTable";
import { CreateForm } from "@/app/ui/form/button-form";

function FormTableSkeleton() {
    return <FormsResponsiveTable forms={[]} loading={true} />
}

const pluralName = "Formas/Tipos";

export default async function TableForm({ searchParams }) {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            {pluralName}
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {`Gestiona las ${pluralName} del sistema`}
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <CreateForm />
                    </div>
                </div>
            </div>

            {/* Table con Suspense*/}
            <Suspense
                key={JSON.stringify(searchParams)}
                fallback={<FormTableSkeleton />}
            >
                <FormsTableWrapper
                    query={searchParams?.query || ""}
                    page={searchParams?.page || "1"}
                    limit={searchParams?.limit || "10"}
                    sort={searchParams?.sort || "name_location"}
                    order={searchParams?.order || "asc"}
                />
            </Suspense>

            {/* Footer info */}
            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                <p>💡 <strong>Tip:</strong> {`Usa la búsqueda para filtrar ${pluralName.toLowerCase()} en tiempo real.`}</p>
            </div>
        </div>
    )
}
