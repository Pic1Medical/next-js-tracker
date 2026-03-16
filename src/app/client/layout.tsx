import { AuthGuard } from "@/src/components/custom/AuthGuard";
import {
  SiteFooter,
  SiteHeader,
  SiteSidebar,
} from "@/src/components/custom/site";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import { TooltipProvider } from "@/src/components/ui/tooltip";

export default function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <TooltipProvider>
          <SiteSidebar />
          <main className="w-full h-svh flex flex-col bg-background text-foreground overflow-hidden">
            <SiteHeader />
            <div className="overflow-auto px-2 py-4 flex flex-col">
              {children}
            </div>
            <SiteFooter />
          </main>
        </TooltipProvider>
      </SidebarProvider>
    </AuthGuard>
  );
}
