"use client";
import { Authenticator, type UseAuthenticator } from "@aws-amplify/ui-react";
import React from "react";
import Header from "@/src/components/Header";

function ClientLayoutImpl(
  { children }: { children: React.ReactNode },
  props: {
    signOut?: UseAuthenticator["signOut"];
    user?: UseAuthenticator["user"];
  }
) {
  return (
    <>
      <Header {...props} />
      <main>{children}</main>
    </>
  );
}

export default function ClientLayout({
  ...props
}: {
  children: React.ReactNode;
}) {
  const Layout = ClientLayoutImpl.bind(null, props);
  return (
    <>
      <Authenticator>{Layout}</Authenticator>
    </>
  );
}
