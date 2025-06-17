import React from "react";

export interface Properties {
  children: React.ReactNode;
}

export default function Container({ children }: Properties) {
  return <div className="d-flex flex-column flex-fill">{children}</div>;
}
