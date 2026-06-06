import { OngSidebar } from "@/components/ong/OngSidebar";

export default function OngLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <OngSidebar />
      <main className="pl-[60px] pt-16">{children}</main>
    </div>
  );
}
