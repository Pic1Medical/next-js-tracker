"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableFooter,
  TableRow,
} from "@components/ui/table";
import { Button } from "../ui/button";
import { ArrowDownToLineIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  hasMore: boolean;
  loadMore: () => void;
  loading: boolean;
  className: string;
  table?: Omit<TableOptions<TData>, "data" | "columns" | "getCoreRowModel">;
}

export function InfiniteDataTable<TData, TValue>({
  columns,
  data,
  hasMore,
  loadMore,
  loading,
  className,
  table: tableProps = {},
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    ...tableProps,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className={cn("overflow-auto rounded-md border", className)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : loading ? null : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
            {loading ? (
              <>
                <TableRow
                  role="status"
                  className="animate-pulse"
                >
                  <TableCell
                    colSpan={columns.length}
                    className="h-8 bg-card"
                  ></TableCell>
                </TableRow>
                <TableRow
                  role="status"
                  className="animate-pulse delay-150"
                >
                  <TableCell
                    colSpan={columns.length}
                    className="h-8 bg-card text-center"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
                <TableRow
                  role="status"
                  className="animate-pulse delay-300"
                >
                  <TableCell
                    colSpan={columns.length}
                    className="h-8 bg-card"
                  ></TableCell>
                </TableRow>
              </>
            ) : null}
          </TableBody>
          {data.length > 0 ? (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={columns.length}>
                  {hasMore ? (
                    <Button
                      className="w-full"
                      variant="ghost"
                      onClick={loadMore}
                      disabled={loading}
                    >
                      <span>Show More</span>
                      <ArrowDownToLineIcon />
                    </Button>
                  ) : (
                    <p>
                      Showing all {data.length} results, nothing left to load...
                    </p>
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          ) : null}
        </Table>
      </div>
    </>
  );
}
