import { Sidebar } from "@/components/ui/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#f8f6f2] md:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 px-5 py-6 md:px-8 lg:px-10">
        {children}
      </main>
    </div>
  );
}
