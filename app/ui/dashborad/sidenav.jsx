import Link from "next/link";
import NavLinks from "@/app/ui/dashborad/nav-links";
//import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon, HomeModernIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-3 md:px-4">
      {/* Logo Section */}
      <div className="mb-6 flex h-16 mt-4 shadow-md rounded-md">
        <Link
          className="mb-2 flex h-16 items-end justify-start rounded-md bg-blue-500 
          p-4 md:h-18 shadow-md hover:bg-blue-400 "
          href="/"
        >
          <HomeModernIcon className="w-6 " />
          <div className="w-full ml-2 md:w-40 justify-center dark:text-black text-white ">Medical-Inventory</div>
        </Link>
      </div>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <div>
          <NavLinks />
          <form
            action={async () => {
              "use server";
              await signOut();
              redirect("/login");
            }}
          >
            <button className="flex items-center w-full 
              text-black justify-start gap-2 rounded-md bg-gray-50 p-3 
              font-medium hover:bg-gray-200 hover:text-blue-800 shadow-md">
              <PowerIcon className="w-6 h-6" />
              <p className="  ">Sign Out</p>
              {/* <ChevronRightIcon className="w-6 h-6 ml-auto" /> */}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
