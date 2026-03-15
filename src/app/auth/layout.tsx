import { Metadata } from "next";
import styles from "./layout.module.css";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <main className={styles["auth-layout-main"]}>{children}</main>;
}
