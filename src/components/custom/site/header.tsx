import { SidebarIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { SidebarTrigger } from "../../ui/sidebar";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 left-0 right-0 w-full min-h-12 h-12 flex flex-row items-center justify-start border-b px-2 gap-2 bg-sidebar text-sidebar-foreground isolate z-10">
      <SidebarTrigger
        variant="outline"
        className="mx-1.5"
        title="Toggle Sidebar"
      >
        <SidebarIcon />
      </SidebarTrigger>
      <div
        className="h-full px-1.5 pl-4 border-l grow flex flex-row items-center justify-start gap-1.5"
        id="header-portal"
      />
    </header>
  );
}
