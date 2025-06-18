import { UseAuthenticator } from "@aws-amplify/ui-react";
import styles from "./Header.module.scss";
import Image from "next/image";
import FavIcon from "@app/favicon.ico";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";

export interface Props {
  user?: UseAuthenticator["user"];
  signOut?: UseAuthenticator["signOut"];
}

function NavLink({ href, children }: { href: string; children: { icon: React.ReactNode; text: React.ReactNode } }) {
  const isActive = usePathname().startsWith(href);
  return (
    <Link
      href={href}
      className="nav-item"
      aria-selected={isActive}
      tabIndex={0}
    >
      <span
        className="nav-item-icon"
        aria-hidden
      >
        {children.icon}
      </span>
      <span className="nav-item-text">{children.text}</span>
    </Link>
  );
}

export default function Header({ user, signOut }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [full, setFull] = useState(false);
  useEffect(() => {
    if (expanded) setFull(false);
  }, [expanded]);
  return (
    <>
      <header className={styles["header"]}>
        <button
          className="btn btn-light btn-icon"
          onClick={() => setExpanded(!expanded)}
        >
          <Image
            className="icon"
            src={FavIcon}
            alt="ICO"
            aria-hidden
          />
        </button>
        <Link
          className="btn btn-link fw-bold"
          href="/client"
        >
          Pic1Medical
        </Link>
        <div className="ms-auto">
          <span>{user.signInDetails.loginId}</span>
        </div>
      </header>
      <Sidebar expanded={expanded}>
        {{
          content: (
            <nav
              className="nav"
              aria-expanded={full}
            >
              <NavLink href="/client">
                {{
                  icon: <i className="bi bi-house-fill"></i>,
                  text: "Home",
                }}
              </NavLink>
              <NavLink href="/client/inventory">
                {{
                  icon: <i className="bi bi-archive-fill"></i>,
                  text: "Inventory",
                }}
              </NavLink>
              <NavLink href="/client/service">
                {{
                  icon: <i className="bi bi-wrench-adjustable"></i>,
                  text: "Service",
                }}
              </NavLink>
            </nav>
          ),
          footer: (
            <>
              <div
                className="btn-grid btn-grid-reverse"
                aria-expanded={full}
              >
                <button
                  className="btn btn-inline btn-text-light justify-content-center"
                  onClick={() => setFull(!full)}
                >
                  <i
                    className="bi bi-arrows-collapse-vertical"
                    aria-hidden
                  ></i>
                </button>
                <button
                  className="btn btn-text-danger btn-inline group"
                  onClick={() => signOut()}
                >
                  <i
                    className="bi bi-door-closed-fill g-hover-hide"
                    aria-hidden
                  ></i>
                  <i
                    className="bi bi-door-open-fill g-hover-show"
                    aria-hidden
                  ></i>
                  <span className="visually-hidden">Logout</span>
                </button>
              </div>
            </>
          ),
        }}
      </Sidebar>
    </>
  );
}
