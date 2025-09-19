import SideNav from "@/app/ui/dashborad/sidenav";
import ModeToggle from "@/components/theme-toggle";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden ">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
    </div>
  );
}
