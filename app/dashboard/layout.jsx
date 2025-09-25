'use client';

import { useState, useEffect } from 'react';
import SideNav from '@/app/ui/dashborad/sidenav';
import MobileNav from '@/app/ui/dashborad/mobile-nav';
import ModeToggle from '@/components/theme-toggle';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      // Cerrar menú móvil si se cambia a desktop
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    // Verificar al cargar
    checkScreenSize();

    // Escuchar cambios de tamaño
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Cerrar menú móvil al hacer clic en overlay
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Desktop Sidebar - Solo visible en md+ */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SideNav />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <MobileNav onClose={closeMobileMenu} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Bar - Solo visible en móvil */}
        <div className="md:hidden">
          <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-16 px-4">
              {/* Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>

              {/* Mobile Logo */}
              <div className="flex items-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Medical Inventory
                </span>
              </div>

              {/* Mode Toggle */}
              <ModeToggle />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>

        {/* Desktop Mode Toggle - Posición fija */}
        <div className="hidden md:block fixed top-4 right-4 z-30">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
