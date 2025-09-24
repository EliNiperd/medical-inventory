import Link from "next/link";
import NavLinks from "@/app/ui/dashborad/nav-links";
import { PowerIcon, HomeModernIcon } from "@heroicons/react/24/outline";
import { signOutAction } from "@/app/lib/auth-actions";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
      
      {/* Logo Section */}
      <div className="p-4">
        <Link
          href="/"
          className="flex items-center h-12 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md transition-all duration-200 hover:shadow-lg"
        >
          <HomeModernIcon className="w-6 h-6 flex-shrink-0" />
          <span className="ml-3 font-medium text-sm">
            Medical Inventory
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-2">
        <nav className="space-y-1">
          <NavLinks />
        </nav>
      </div>

      {/* Sign Out Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form action={signOutAction}>
          <button 
            type="submit"
            className="flex items-center w-full text-gray-700 dark:text-gray-300 justify-start gap-3 rounded-md bg-gray-50 dark:bg-gray-700 p-3 font-medium hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <PowerIcon className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </form>
      </div>
    </div>
  );
}