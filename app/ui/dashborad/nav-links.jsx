'use client';

import {
  UserGroupIcon,
  HomeIcon,
  BeakerIcon,
  CubeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  RectangleStackIcon,
  RectangleGroupIcon,
  SquaresPlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';

// Organizar links por categorías
const navigationStructure = [
  {
    category: 'Principal',
    items: [{ name: 'Dashboard', href: '/dashboard', icon: HomeIcon, priority: 'high' }],
  },
  {
    category: 'Gestión',
    items: [
      { name: 'Medicamentos', href: '/dashboard/medicine', icon: BeakerIcon, priority: 'high' },
      { name: 'Inventario', href: '/dashboard/inventory', icon: CubeIcon, priority: 'high' },
      { name: 'Usuarios', href: '/dashboard/user', icon: UserGroupIcon, priority: 'medium' },
    ],
  },
  {
    category: 'Configuración',
    collapsible: true,
    items: [
      {
        name: 'Ubicaciones',
        href: '/dashboard/location',
        icon: RectangleStackIcon,
        priority: 'low',
      },
      { name: 'Tipos/Formas', href: '/dashboard/form', icon: RectangleGroupIcon, priority: 'low' },
      {
        name: 'Presentaciones',
        href: '/dashboard/category',
        icon: SquaresPlusIcon,
        priority: 'low',
      },
      {
        name: 'Configuración',
        href: '/dashboard/settings',
        icon: Cog6ToothIcon,
        priority: 'medium',
      },
    ],
  },
  {
    category: 'Análisis',
    items: [
      { name: 'Reportes', href: '/dashboard/reports', icon: ChartBarIcon, priority: 'medium' },
    ],
  },
];

export default function NavLinks({ onLinkClick }) {
  const pathname = usePathname();
  const [collapsedSections, setCollapsedSections] = useState(new Set(['Configuración']));

  const toggleSection = (category) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');
  const isSectionActive = (items) => items.some((item) => isActive(item.href));

  return (
    <nav className="space-y-1">
      {/* Vista Desktop/Tablet - Navegación completa con categorías */}
      <div className="hidden md:block space-y-4">
        {navigationStructure.map((section) => {
          const sectionActive = isSectionActive(section.items);
          const isCollapsed = collapsedSections.has(section.category);

          return (
            <div key={section.category} className="space-y-1">
              {/* Header de sección */}
              {section.category !== 'Principal' && (
                <div className="flex items-center justify-between px-3 py-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {section.category}
                  </h3>

                  {section.collapsible && (
                    <button
                      onClick={() => toggleSection(section.category)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      {isCollapsed ? (
                        <ChevronRightIcon className="h-3 w-3 text-gray-400" />
                      ) : (
                        <ChevronDownIcon className="h-3 w-3 text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Items de la sección */}
              <div className={clsx('space-y-1', section.collapsible && isCollapsed && 'hidden')}>
                {section.items.map((link) => {
                  const LinkIcon = link.icon;
                  const linkActive = isActive(link.href);

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={onLinkClick}
                      className={clsx(
                        'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        {
                          'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200':
                            linkActive,
                          'text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400':
                            !linkActive,
                        }
                      )}
                    >
                      <LinkIcon
                        className={clsx(
                          'mr-3 h-5 w-5',
                          linkActive
                            ? 'text-blue-500 dark:text-blue-300'
                            : 'text-gray-400 group-hover:text-blue-500'
                        )}
                      />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Vista Mobile - Solo elementos prioritarios */}
      <div className="block md:hidden">
        <div className="grid grid-cols-2 gap-2">
          {navigationStructure
            .flatMap((section) => section.items)
            .filter((item) => item.priority === 'high')
            .map((link) => {
              const LinkIcon = link.icon;
              const linkActive = isActive(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onLinkClick}
                  className={clsx(
                    'flex flex-col items-center justify-center p-4 rounded-lg transition-colors text-center',
                    {
                      'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200': linkActive,
                      'text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400':
                        !linkActive,
                    }
                  )}
                >
                  <LinkIcon
                    className={clsx(
                      'h-6 w-6 mb-1',
                      linkActive ? 'text-blue-500 dark:text-blue-300' : 'text-gray-400'
                    )}
                  />
                  <span className="text-xs font-medium">{link.name}</span>
                </Link>
              );
            })}
        </div>

        {/* Sección "Más opciones" para mobile */}
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <CollapsibleMobileSection
            title="Más opciones"
            items={navigationStructure
              .flatMap((section) => section.items)
              .filter((item) => item.priority !== 'high')}
            onLinkClick={onLinkClick}
            pathname={pathname}
          />
        </div>
      </div>
    </nav>
  );
}

// Componente para sección colapsable en mobile
function CollapsibleMobileSection({ title, items, onLinkClick, pathname }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasActiveItem = items.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  );

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={clsx(
          'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors',
          hasActiveItem
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        )}
      >
        <span>{title}</span>
        <ChevronDownIcon
          className={clsx('h-4 w-4 transition-transform', isExpanded ? 'rotate-180' : '')}
        />
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-1 pl-4">
          {items.map((link) => {
            const LinkIcon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => {
                  onLinkClick?.();
                  setIsExpanded(false);
                }}
                className={clsx(
                  'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                  {
                    'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200': isActive,
                    'text-gray-600 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700':
                      !isActive,
                  }
                )}
              >
                <LinkIcon
                  className={clsx('mr-2 h-4 w-4', isActive ? 'text-blue-500' : 'text-gray-400')}
                />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
