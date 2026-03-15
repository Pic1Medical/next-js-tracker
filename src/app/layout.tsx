"use client";
// Configure AWS Amplify so that we can proceed.
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs);

import "@src/styles/globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/src/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

// Export our "root" layout to begin our website.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable)}
    >
      <head>
        <title>Pic1Medical</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
