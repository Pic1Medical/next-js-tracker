"use client";
// Configure AWS Amplify so that we can proceed.
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs);

// Import Bootstrap Styles + AWS Amplify Styles.
// import "bootstrap/dist/css/bootstrap.min.css"; <- custom theme applied in style.scss (import not needed).
//import "bootstrap/dist/js/bootstrap.min.js"; NEXT.JS hates this import for some reason, AWS Amplify won't accept it if NEXT.JS doesn't.
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "@aws-amplify/ui-react/styles.css";
import "./style.scss";
import Script from "next/script";

// Export our "root" layout to begin our website.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" />
      </body>
    </html>
  );
}
