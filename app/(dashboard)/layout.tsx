import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full bg-background flex relative">
      <Sidebar />
      <div className="w-full h-full flex flex-col">
        <Navbar />
        <main className="flex-1 p-5 relative">{children}</main>
      </div>
    </div>
  );
}
