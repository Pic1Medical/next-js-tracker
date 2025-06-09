import Image from "next/image";
import Icon from "@app/favicon.ico";
import { UseAuthenticator } from "@aws-amplify/ui-react";
import { usePathname } from "next/navigation";
import React from "react";

export default function Header({
  signOut,
  user,
}: {
  signOut?: UseAuthenticator["signOut"];
  user?: UseAuthenticator["user"];
}) {
  const pathname = usePathname();
  function NavLink({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) {
    const active = pathname === to;
    return (
      <li className="nav-item">
        <a
          className={`nav-link ${active ? "active disabled" : ""}`}
          aria-disabled={active}
          href={to}
        >
          {children}
          <i className="bi bi-link-45deg"></i>
        </a>
      </li>
    );
  }

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-body-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/client">
            <Image
              src={Icon}
              height="30"
              alt="Pic1Medical"
              className="d-inline-block align-text-top rounded me-2"
              aria-hidden
            />
            Pic1Medical
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <NavLink to="/client">Dashboard</NavLink>
              <NavLink to="/client/inventory">Inventory</NavLink>
              <NavLink to="/client/service">Service</NavLink>
            </ul>
            <div className="text-light d-flex flex-nowrap align-items-center gap-3">
              <span>{user?.signInDetails?.loginId ?? "Unknown User"}</span>
              <button className="btn btn-outline-light" onClick={signOut}>
                <i className="bi bi-door-closed-fill hide-on-group-hover"></i>
                <i className="bi bi-door-open-fill show-on-group-hover"></i>
                &nbsp;SignOut
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
