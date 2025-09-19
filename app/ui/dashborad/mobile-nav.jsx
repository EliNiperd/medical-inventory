"use client";

import Link from "next/link";
import NavLinks from "@/app/ui/dashborad/nav-links";
import { PowerIcon, HomeModernIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { signOutAction } from "@/app/lib/auth-actions";
import { useFormStatus } from "react-dom";

function SignOutButton() {
  const { pending } = useFormStatus();
  
  return (
    <button 
      type="submit"
      disabled={pending}
      className="flex items-center w-full text-gray-700 dark:text-gray-300 justify-start gap-3 rounded-md bg-gray-50 dark:bg-gray-700 p-3 font-medium hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
    >
      <PowerIcon className="w-5 h-5" />
      <span>{pending ? 'Cerrando...' : 'Cerrar Sesión'}</span>
    </button>
  );
}

export default function MobileNav({ onClose }) {
  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-800 shadow-xl">
      
      {/* Header con botón cerrar */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <HomeModernIcon className="w-6 h-6 text-blue-500 mr-2" />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Medical Inventory
          </span>
        </div>
        
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-4">
        <nav className="space-y-2">
          <NavLinks onLinkClick={onClose} />
        </nav>
      </div>

      {/* Sign Out Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form action={signOutAction}>
          <SignOutButton />
        </form>
      </div>
    </div>
  );
}