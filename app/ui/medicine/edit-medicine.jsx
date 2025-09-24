'use client';

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
import { updateMedicine } from "@/app/dashboard/medicine/actions";

export default function Form({ medicine, categories, forms, locations }) {
  const updateMedicineWithId = updateMedicine.bind(null, medicine.id);
  //const { updateMedicineWithId } = medicineEditForm;

  const expirationDate = medicine.expiration_date.toISOString().split("T")[0];
  return (
    <form action={updateMedicineWithId}>
      <div className=" form-basic max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {/* Medicine Name */}
        <div className=" col-span-2 ">
          <label htmlFor="name">
            Nombre
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={medicine.name}
                placeholder="Ingrese el nombre del medicamento"
                className="input-form"
              />
              <QueueListIcon className="icon-input" />
            </div>
          </div>
        </div>
        {/* Medicine Description */}
        <div className="mb-2 col-span-2 ">
          <label
            htmlFor="description"
          >
            Descripción
          </label>
          <div className="relative rounded-md">
            <div className="relative">
              <textarea
                type="text"
                id="description"
                name="description"
                defaultValue={medicine.description}
                placeholder="Ingrese la descripción del medicamento (sustancia(s) activa(s), uso, etc.)"
                className="input-form"
              />
              <DocumentTextIcon className="icon-input top-5" />
            </div>
          </div>
        </div>

        {/* Category */}
        <div >
          <label htmlFor="category" >
            Categoría
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              className="input-form"
              defaultValue={medicine.idCategory}
            >
              <option value="" disabled>
                Seleccionar categoría
              </option>
              {categories.map((category) => (
                <option key={category.id_category} value={category.id_category}>
                  {category.name}
                </option>
              ))}
            </select>
            <InboxStackIcon className="icon-input" />
          </div>
        </div>

        {/* Form (Presentación) */}
        <div >
          <label htmlFor="form" >
            Presentación
          </label>
          <div className="relative">
            <select
              id="form"
              name="form"
              className="input-form"
              defaultValue={medicine.id_form}
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
            <SwatchIcon className="icon-input" />
          </div>
        </div>

        {/* Medicine Quantity */}
        <div className="mb-2">
          <label htmlFor="quantity" >
            Cantidad:
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="quantity"
                name="quantity"
                defaultValue={medicine.quantity}
                type="number"
                step="1"
                placeholder="Ingrese cantidad"
                className="input-form-number"
              />
              <CalculatorIcon className="icon-input" />
            </div>
          </div>
        </div>
        {/* PackSize (Cantidad de paquetes) */}
        <div className="mb-2">
          <label htmlFor="packsize" >
            Paquetes (de la presentación)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="packsize"
                name="packsize"
                defaultValue={medicine.packsize}
                type="number"
                step="1"
                min={1}
                placeholder="Ingrese cantidad"
                className="input-form-number"
              />
              <CalculatorIcon className="icon-input" />
            </div>
          </div>
        </div>
        {/* reorder_point (Punto de Reorden) */}
        <div >
          <label
            htmlFor="reorder_point"
          >
            Punto de reorden
          </label>
          <div className="relative rounded-md">
            <div className="relative">
              <input
                id="reorder_point"
                name="reorder_point"
                defaultValue={medicine.reorder_point}
                type="number"
                step="1"
                min={0}
                placeholder="Ingrese cantidad"
                className="input-form-number"
              />
              <CalculatorIcon className="icon-input" />
            </div>
          </div>
        </div>

        {/*Medicine expiration_date (Fecha de caducidad)*/}
        <div >
          <label
            htmlFor="expirationDate"
          >
            Fecha de caducidad
          </label>
          <div className="relative rounded-md">
            <div className="relative">
              <input
                id="expirationDate"
                name="expirationDate"
                defaultValue={expirationDate}
                type="date"
                className="input-form-number"
              />
              <CalendarIcon className="icon-input" />
            </div>
          </div>
        </div>

        {/* Location (ubicación) */}
        <div >
          <label htmlFor="location" >
            Ubicación
          </label>
          <div className="relative">
            <select
              id="location"
              name="location"
              defaultValue={medicine.idLocation}
              className="input-form"
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
            <GlobeAmericasIcon className="icon-input" />
          </div>
        </div>

        {/*Medicine price*/}
        <div>
          <label htmlFor="price" >
            Precio
          </label>
          <div className="relative rounded-md">
            <div className="relative">
              <input
                id="price"
                name="price"
                defaultValue={medicine.price}
                type="number"
                step="0.01"
                placeholder="Ingrese precio, MXP"
                className="input-form-number"
              />
              <CurrencyDollarIcon className="icon-input" />
            </div>
          </div>
        </div>
        <div className="col-span-2  flex justify-end gap-2 border-t pt-4 pb-4  ">
          <Link
            href="/dashboard/medicine"
            className="btn-form-cancel"
          >
            Cancelar
          </Link>
          <Button type="submit" className="btn-form-submit">
            Guardar información
          </Button>
        </div>
      </div>
    </form>
  );
}
