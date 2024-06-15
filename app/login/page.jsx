//import AcmeLogo from "@/app/ui/acme-logo";
import LoginForm from "@/app/ui/login-form";
import ModeToggle from "@/components/theme-toggle";

export default function LoginPage() {
  return (
    <div>
      <div className=" absolute text-right w-full pr-6 pt-6">
        <ModeToggle />
      </div>
      <main className="flex items-center justify-center md:h-screen ">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col  p-4 m:-mt-32">
          <div className="flex h-20 w-full items-end rounded-lg bg-primary-500 p-3 md:h-36">
            <div className="w-32 md:w-36">{/*<AcmeLogo />*/}</div>
          </div>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
