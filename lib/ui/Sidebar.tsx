import React, { useState } from "react";

export type SidebarSize = "sm" | "md" | "lg";

export interface Props {
  expanded: boolean | [boolean, (v: boolean | ((v: boolean) => boolean)) => void];
  side?: "left" | "right";
  children?:
    | React.ReactNode
    | {
        header?: React.ReactNode;
        content: React.ReactNode;
        footer?: React.ReactNode;
      };
}

export default function Sidebar({ side = "left", expanded: _expanded, children }: Props) {
  const expanded = typeof _expanded === "object" ? _expanded[0] : _expanded;
  const hasExtendedChildren = typeof children === "object" && "content" in children;
  const SidebarHeader = hasExtendedChildren ? children.header : undefined;
  const SidebarContent = hasExtendedChildren ? children.content : children;
  const SidebarFooter = hasExtendedChildren ? children.footer : undefined;
  return (
    <aside
      className={`sidebar sidebar-${side}`}
      aria-expanded={expanded}
    >
      {SidebarHeader && <section className="sidebar-header">{SidebarHeader}</section>}
      <section className="sidebar-content">{SidebarContent}</section>
      {SidebarFooter && <section className="sidebar-footer">{SidebarFooter}</section>}
    </aside>
  );
}
