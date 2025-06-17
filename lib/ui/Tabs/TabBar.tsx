import Link from "next/link";
import { usePathname } from "next/navigation";

export interface Tab {
  to: string;
  name: string;
  icon?: `bi-${string}`;
  label: string;
  active?: BooleanIsh | "exact";
}

export interface Properties {
  rel?: string;
  children?: Array<Tab>;
}

export function _Tab({ to, icon, label, active }: Tab) {
  if (to.endsWith("/")) to = to.slice(0, to.length - 1);
  const pathname = usePathname();
  let selected = false;
  if (typeof active == "string") {
    if (active === "exact") {
      selected = pathname === to;
    } else selected = Boolean(active);
  } else if (typeof active == "boolean") {
    selected = active;
  } else {
    selected = pathname.startsWith(to);
  }
  return (
    <li className="nav-item">
      <Link
        href={to}
        className={`nav-link ${selected && "active"}`}
      >
        {icon && (
          <i
            className={`bi ${icon}`}
            aria-hidden
          >
            &nbsp;
          </i>
        )}
        {label}
      </Link>
    </li>
  );
}

export default function Navbar({ rel, children }: Properties) {
  return (
    <ul className="nav nav-underline px-3">
      {children.map((tab) => (
        <_Tab
          {...tab}
          key={tab.name}
          to={`${rel}${tab.to}`}
        />
      ))}
    </ul>
  );
}
