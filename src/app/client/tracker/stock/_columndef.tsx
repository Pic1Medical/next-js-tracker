"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProductWithStockInfoType } from "@api/product";
import { Checkbox } from "@/src/components/ui/checkbox";

export const columns: Array<ColumnDef<ProductWithStockInfoType>> = [
  {
    accessorKey: "selected",
    header(props) {
      return (
        <Checkbox
          checked={
            props.table.getIsSomeRowsSelected()
              ? "indeterminate"
              : props.table.getIsAllRowsSelected()
          }
          onClick={() => props.table.toggleAllRowsSelected(false)}
        />
      );
    },
    cell(props) {
      return (
        <Checkbox
          checked={props.row.getIsSelected()}
          onClick={() => props.row.toggleSelected()}
        />
      );
    },
  },
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
