import { AppHeader } from "@/components/dashboard/app-header";

export default function DashboardLayout({ children }: LayoutProps<"/[locale]/dashboard">) {
  return (
    <div className="flex flex-1 flex-col bg-secondary/20">
      <AppHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
