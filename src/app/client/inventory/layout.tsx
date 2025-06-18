"use client";

import TabPanel from "@lib/ui/TabPanel";
import { usePathname, useRouter } from "next/navigation";

// import { Container, TabBar, Viewport } from "@lib/ui/Tabs";

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.split("/")[3];
  return (
    <TabPanel activeTab={activeTab}>
      {{
        tabs: [
          {
            name: "search",
            label(props) {
              return (
                <>
                  <i
                    className="bi bi-search"
                    aria-hidden
                  >
                    &nbsp;
                  </i>
                  <span>Search</span>
                </>
              );
            },
            onClick() {
              router.push("/client/inventory/search");
            },
          },
          {
            name: "create",
            label(props) {
              return (
                <>
                  <i
                    className="bi bi-pencil-fill"
                    aria-hidden
                  >
                    &nbsp;
                  </i>
                  <span>Create</span>
                </>
              );
            },
            onClick() {
              router.push("/client/inventory/create");
            },
          },
        ],
        viewport: children,
      }}
    </TabPanel>
  );
}
