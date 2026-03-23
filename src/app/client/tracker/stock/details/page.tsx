"use client";
import { redirect, useSearchParams } from "next/navigation";

export default function StockDetailsPage() {
  const params = useSearchParams();
  if (!params.has("id")) return redirect("/client/dashboard/tracker/stock");

  return (
    <>
      <section></section>
    </>
  );
}
