import { nunito } from "@/app/ui/fonts";

export default async function Page() {
  return (
    <main>
      <h1 className={`${nunito.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <p className={`${nunito.className} text-base md:text-lg`}>
        This is a dashboard page.
      </p>
    </main>
  );
}
