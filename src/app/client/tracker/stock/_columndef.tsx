"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProductWithStockInfoType } from "@api/product";

export const columns: Array<ColumnDef<ProductWithStockInfoType>> = [
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "categoryId",
    header: "Category",
    accessorFn: (row) => row.category.name,
  },
  {
    accessorKey: "partNo",
    header: "Part #",
  },
  {
    accessorKey: "desc",
    header: "Description",
  },
];
