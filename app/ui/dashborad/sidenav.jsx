import Link from "next/link";
import NavLinks from "@/app/ui/dashborad/nav-links";
//import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon, HomeModernIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 mt-2 flex h-18 items-end justify-start rounded-md bg-blue-600 p-4 md:h-20"
        href="/"
      >
        <HomeModernIcon className="w-6 mt-2 " />
        <div className="w-full text-white md:w-40 justify-center ml-2">Medical-Inventory</div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <div>
          <NavLinks />
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="flex items-center bg-red-500 h-[48px] w-full  text-black justify-start  gap-2 rounded-md bg-gray-50 p-3 font-medium hover:bg-sky-100 hover:text-blue-600  ">
              <PowerIcon className="w-6 h-6" />
              <p className="  ">Sign Out</p>
              <ChevronRightIcon className="w-6 h-6 ml-auto" />
            </button>

          </form>

        </div>
        <div>

        </div>
      </div>
    </div>
  );
}
