"use client";
import { DataTable } from "@/src/components/custom/table";
import { useEffect, useState } from "react";
import { columns } from "./_columndef";
import {
  getProductsWithStockInfo,
  ProductWithStockInfoType,
} from "@api/product";

export default function StockSearchPage() {
  const [entries, setEntries] = useState<Array<ProductWithStockInfoType>>([]);

  useEffect(() => {
    (async () => {
      const data = await getProductsWithStockInfo();
      setEntries(data);
    })().catch((err) => {
      console.error(err);
    });
  }, [setEntries]);

  return (
    <>
      <section className="container mx-auto px-4">
        <DataTable
          columns={columns}
          data={entries}
        />
      </section>
    </>
  );
}
