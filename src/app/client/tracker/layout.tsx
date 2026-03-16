import React from "react";
import TrackerMenubar from "./_menubar";

export default function TrackerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <TrackerMenubar />
      {children}
    </>
  );
}
