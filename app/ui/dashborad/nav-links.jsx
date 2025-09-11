"use client";
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  RectangleGroupIcon,
  SwatchIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Inicio", href: "/dashboard", icon: HomeIcon },
  { name: "Inventario", href: "/dashboard/medicine", icon: DocumentDuplicateIcon },
  { name: "Ubicaciones", href: "/dashboard/location", icon: UserGroupIcon },
  { name: "Tipos/Formas", href: "/dashboard/form", icon: RectangleGroupIcon },
  //{ name: "Presentaciones", href: "/dashboard/presentation", icon: SwatchIcon },
  { name: "Usuarios", href: "/dashboard/admin/user", icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] w-full  text-black justify-start gap-2 rounded-md bg-gray-50 p-1 mb-2  text-sm hover:bg-sky-100 hover:text-blue-600  justify-start pl-2 pr-0",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <div className="flex items-center w-full ">
              <div className="flex items-center  gap-2">
                <LinkIcon className="w-6 h-6" />
                <span>{link.name}</span>
              </div>
              <ChevronRightIcon className="w-6 h-6 ml-auto sm:hidden" />
            </div>
          </Link>
        );
      })}
    </>
  );
}
