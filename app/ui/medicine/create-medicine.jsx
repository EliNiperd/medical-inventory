import {
  DocumentTextIcon,
  QueueListIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CalculatorIcon,
  InboxStackIcon,
  SwatchIcon,
  GlobeAmericasIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Button from "@/app/ui/button";
import { createMedicine } from "@/app/dashboard/medicine/actions";

export default function Form({ categorys, forms, locations }) {
  //console.log("category in Form: ", categorys);
  return (
    <form action={createMedicine}>
      <div className="grid col-span-2 rounded-md w-9/12 bg-gray-50 p-4 md:p-6">
        {/* Medicine Name */}
        <div className="mb-4 col-span-2 ">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Nombre
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Ingrese el nombre del medicamento"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <QueueListIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* Medicine Description */}
        <div className="mb-4 col-span-2 ">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Descripción
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                type="text"
                id="description"
                name="description"
                placeholder="Ingrese la descripción del medicamento (sustancia(s) activa(s), uso, etc.)"
                className="peer block w-full rounded-md border border-gray-200 py-1 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="mb-2">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Categoría
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              className="peer block  cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
            >
              <option value="" disabled>
                Seleccionar categoría
              </option>
              {categorys.map((category) => (
                <option key={category.id_category} value={category.id_category}>
                  {category.name}
                </option>
              ))}
            </select>
            <InboxStackIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Form (Presentación) */}
        <div className="mb-2">
          <label htmlFor="form" className="mb-2 block text-sm font-medium">
            Presentación
          </label>
          <div className="relative">
            <select
              id="form"
              name="form"
              className="peer block  cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
            >
              <option value="" disabled>
                Seleccionar presentación
              </option>
              {forms.map((form) => (
                <option key={form.id_form} value={form.id_form}>
                  {form.form_name}
                </option>
              ))}
            </select>
            <SwatchIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Medicine Quantity */}
        <div className="mb-2">
          <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
            Cantidad:
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="quantity"
                name="quantity"
                type="number"
                step="1"
                placeholder="Ingrese cantidad"
                className="peer block  rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CalculatorIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* PackSize (Cantidad de paquetes) */}
        <div className="mb-2">
          <label htmlFor="packsize" className="mb-2 block text-sm font-medium">
            Paquetes (de la presentación)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="packsize"
                name="packsize"
                type="number"
                step="1"
                min={1}
                placeholder="Ingrese cantidad"
                className="peer block  rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CalculatorIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* reorder_point (Punto de Reorden) */}
        <div className="mb-2">
          <label
            htmlFor="reorder_point"
            className="mb-2 block text-sm font-medium"
          >
            Punto de reorden
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="reorder_point"
                name="reorder_point"
                type="number"
                step="1"
                min={0}
                placeholder="Ingrese cantidad"
                className="peer block  rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CalculatorIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/*Medicine expiration_date (Fecha de caducidad)*/}
        <div className="mb-2">
          <label
            htmlFor="expirationDate"
            className="mb-2 block text-sm font-medium"
          >
            Fecha de caducidad
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="expirationDate"
                name="expirationDate"
                type="date"
                className="peer block  rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Location (ubicación) */}
        <div className="mb-2">
          <label htmlFor="location" className="mb-2 block text-sm font-medium">
            Ubicación
          </label>
          <div className="relative">
            <select
              id="location"
              name="location"
              className="peer block  cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
            >
              <option value="" disabled>
                Seleccionar ubicación
              </option>
              {locations.map((location) => (
                <option key={location.id_location} value={location.id_location}>
                  {location.location_name}
                </option>
              ))}
            </select>
            <GlobeAmericasIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/*Medicine price*/}
        <div className="mb-2  ">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Precio
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                placeholder="Ingrese precio, MXP"
                className="peer block  rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        <div className="col-span-2 mt-6 mr-6 flex justify-end gap-2  ">
          <Link
            href="/dashboard/medicine"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancelar
          </Link>
          <Button type="submit" className="pr-4">
            Guardar información
          </Button>
        </div>
      </div>
    </form>
  );
}
