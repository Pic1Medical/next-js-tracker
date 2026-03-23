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
              href={`/client/tracker/location/details?id=${props.getValue()}`}
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
    header: "Location Name",
  },
  {
    accessorKey: "desc",
    header: "Description",
  },
];
