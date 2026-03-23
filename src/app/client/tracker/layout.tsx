import React from "react";
import TrackerMenubar from "./_menubar";
import TrackerContext from "./_context";

export default function TrackerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TrackerContext>
      <TrackerMenubar />
      {children}
    </TrackerContext>
  );
}
