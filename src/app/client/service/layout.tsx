"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function Tab({ to, children }: { to: string; children: React.ReactNode }) {
  const isActive = usePathname() === to;
  return (
    <li className="nav-item">
      <Link href={to} className={`nav-link ${isActive && "active"}`}>
        {children}
      </Link>
    </li>
  );
}

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ul className="nav nav-tabs" role="tablist">
        <Tab to="/client/service">
          <i className="bi bi-house-fill" aria-hidden>
            &nbsp;
          </i>
          My Service
        </Tab>
        <Tab to="/client/service/reserve">
          <i className="bi bi-quote" aria-hidden>
            &nbsp;
          </i>
          Reserve
        </Tab>
        <Tab to="/client/service/checkout">
          <i className="bi bi-lock-fill" aria-hidden>
            &nbsp;
          </i>
          Checkout
        </Tab>
      </ul>
      <section role="tabpanel" className="mx-4 my-2">
        {children}
      </section>
    </>
  );
}
