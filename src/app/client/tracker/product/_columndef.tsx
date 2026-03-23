"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EntryType } from "./page";
import { ButtonGroup } from "@/src/components/ui/button-group";
import { Button } from "@/src/components/ui/button";
import { EyeIcon } from "lucide-react";
import Link from "next/link";

export const columns: Array<ColumnDef<EntryType>> = [
  {
    accessorKey: "id",
    header: "Actions",
    cell(props) {
      return (
        <ButtonGroup>
          <Button
            variant="outline"
            title="View Entry"
            asChild
          >
            <Link
              href={`/client/tracker/product/details?id=${props.getValue()}`}
            >
              <EyeIcon aria-label="View Entry" />
            </Link>
          </Button>
        </ButtonGroup>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell(props) {
      const value = props.getValue() as string | undefined;
      if (!value)
        return <span className="text-muted-foreground">No Category</span>;
      return <span className="capitalize">{value}</span>;
    },
  },
  {
    accessorKey: "partNo",
    header: "Part Number",
  },
  {
    accessorKey: "desc",
    header: "Description",
  },
];
