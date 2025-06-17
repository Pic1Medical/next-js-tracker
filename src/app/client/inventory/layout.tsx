"use client";

import { Container, TabBar, Viewport } from "@lib/ui/Tabs";

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <TabBar rel="/client/inventory">
        {[
          {
            to: "/search",
            icon: "bi-search",
            name: "search",
            label: "Search",
          },
          {
            to: "/create",
            icon: "bi-plus-square-fill",
            name: "create",
            label: "New",
          },
          {
            to: "/edit",
            icon: "bi-pencil-fill",
            name: "edit",
            label: "Edit",
          },
        ]}
      </TabBar>
      <Viewport>{children}</Viewport>
    </Container>
  );
}

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// function Tab({ to, children }: { to: string; children: React.ReactNode }) {
//   const isActive = usePathname() === to;
//   return (
//     <li className="nav-item">
//       <Link
//         href={to}
//         className={`nav-link ${isActive && "active"}`}
//       >
//         {children}
//       </Link>
//     </li>
//   );
// }

// export default function ServiceLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//       <ul
//         className="nav nav-underline px-4 bg-light border-bottom"
//         style={{ position: "sticky", top: "0", left: "0", zIndex: 10000 }}
//         role="tablist"
//       >
//         <Tab to="/client/inventory/search">
//           <i
//             className="bi bi-search"
//             aria-hidden
//           >
//             &nbsp;
//           </i>
//           Search
//         </Tab>
//         <Tab to="/client/service/reserve">
//           <i
//             className="bi bi-pencil-fill"
//             aria-hidden
//           >
//             &nbsp;
//           </i>
//           Edit
//         </Tab>
//         <Tab to="/client/service/checkout">
//           <i
//             className="bi bi-cloud-plus"
//             aria-hidden
//           >
//             &nbsp;
//           </i>
//           Add&nbsp;Location
//         </Tab>
//       </ul>
//       <section
//         role="tabpanel"
//         className="px-4 py-3"
//       >
//         {children}
//       </section>
//     </>
//   );
// }
