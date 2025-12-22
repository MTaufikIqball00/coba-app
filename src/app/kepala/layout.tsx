import Sidebar from "../components/sidebar";
import PageHeader from "../components/ui/PageHeader";

export default function KepalaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-60 flex flex-col">
        <header className="w-full bg-transparent my-1.5 px-6">
          <PageHeader>
            <a href="/" className="font-bold text-white text-2xl tracking-wide">
              Kepala Sekolah Panel
            </a>
          </PageHeader>
        </header>

        <main className="flex-grow px-6">{children}</main>
      </div>
    </div>
  );
}
