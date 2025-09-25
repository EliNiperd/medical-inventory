'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BeakerIcon,
  CubeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  RectangleStackIcon,
  RectangleGroupIcon,
  SquaresPlusIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
const links = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Medicamentos', href: '/dashboard/medicine', icon: BeakerIcon },
  { name: 'Inventario', href: '/dashboard/inventory', icon: CubeIcon },
  { name: 'Reportes', href: '/dashboard/reports', icon: ChartBarIcon },
  { name: 'Usuarios', href: '/dashboard/user', icon: UserGroupIcon },
  { name: 'Configuración', href: '/dashboard/settings', icon: Cog6ToothIcon },
  { name: 'Ubicaciones', href: '/dashboard/location', icon: RectangleStackIcon },
  { name: 'Tipos/Formas', href: '/dashboard/form', icon: RectangleGroupIcon },
  { name: 'Presentaciones', href: '/dashboard/category', icon: SquaresPlusIcon },
];

export default function NavLinks({ onLinkClick }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={onLinkClick} // Cerrar menú móvil al hacer clic
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium transition-colors md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300': isActive,
                'text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400':
                  !isActive,
              }
            )}
          >
            <LinkIcon className="w-6 h-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
