import { useEffect, useState } from "react";
import styles from "./Table.module.scss";

export interface ColumnDef<T extends object, K extends keyof T = keyof T, V = T[K]> {
  name: K;
  label?: string;
  hidden?: boolean;
  initialValue: V | (() => V);
}

export default function makeTable<T extends object>(columnDefs: Array<ColumnDef<T>>) {
  function resolveInitialValue<T extends object, K extends keyof T, V = T[K]>(v: ColumnDef<T, K, V>["initialValue"]) {
    if (typeof v === "function") return (v as () => V)();
    return v;
  }

  function Table({ className = "", entries, entriesPerPage = 20 }: { className?: string; entries: Array<T>; entriesPerPage?: number }) {
    const columns = columnDefs.filter((col) => !col.hidden);

    const [sortBy, setSortBy] = useState<keyof T | undefined>(undefined);

    const [sortedEntries, setSortedEntries] = useState<Array<T>>([]);

    useEffect(() => {
      let results = entries;
      if (sortBy !== undefined) {
        const column = columns.find((col) => col.name === sortBy);
        if (column && !column.hidden) {
          const value = typeof resolveInitialValue(column);
          if (typeof value === "string") {
            results = results.sort((a, b) => {
              const a_col = a[sortBy];
              const b_col = b[sortBy];
              if (a_col < b_col) return -1;
              if (a_col > b_col) return 1;
              return 0;
            });
          } else if (typeof value === "number") {
            results = results.sort((a, b) => (a[sortBy] as number) - (b[sortBy] as number));
          } else {
            console.error("Unable to sort column with unknown datatype values?! Using original ordering as given to us.");
          }
        }
      }
      setPage(0);
      setSortedEntries(results);
    }, [entries, sortBy]);

    const [pagedEntries, setPagedEntries] = useState<Array<T>>([]);

    const [maxPages, setMaxPages] = useState<number>(Math.ceil(entries.length / entriesPerPage));

    useEffect(() => {
      setMaxPages(Math.ceil(entries.length / entriesPerPage));
    }, [entries, entriesPerPage]);

    const [page, setPage] = useState<number>(0);

    useEffect(() => {
      const currentPage = page;
      const start = currentPage * entriesPerPage;
      const end = start + entriesPerPage;
      setPagedEntries(sortedEntries.slice(start, end));
    }, [sortedEntries, page]);

    return (
      <div className={`${styles["table-border-wrapper"]} ${className}`}>
        <div className={styles["table-container"]}>
          <table className={styles["table"]}>
            <thead className={styles["thead"]}>
              <tr className={styles["trow"]}>
                <th className={styles["th"]}></th>
                {columns.map((col) => (
                  <th
                    key={String(col.name)}
                    className={styles["th"]}
                  >
                    {col.label ?? String(col.name)}
                  </th>
                ))}
                <th className={styles["th"]}>
                  <div className="btn-group btn-group-xs w-100 mr-2 ml-4">
                    <button className="btn btn-secondary">
                      <i
                        className="bi bi-printer-fill"
                        aria-hidden
                      ></i>
                    </button>
                    <button className="btn btn-secondary">
                      <i
                        className="bi bi-printer-fill"
                        aria-hidden
                      ></i>
                    </button>
                    <button className="btn btn-secondary">
                      <i
                        className="bi bi-printer-fill"
                        aria-hidden
                      ></i>
                    </button>
                    <button className="btn btn-secondary">
                      <i
                        className="bi bi-printer-fill"
                        aria-hidden
                      ></i>
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className={styles["tbody"]}>
              {!pagedEntries.length && (
                <tr className={styles["trow"]}>
                  <td
                    className={`${styles["td"]} text-center fw-bold`}
                    colSpan={columns.length + 2}
                  >
                    No results...
                  </td>
                </tr>
              )}
              {pagedEntries.map((row, idx) => (
                <tr
                  key={idx}
                  className={styles["trow"]}
                >
                  <td className={styles["td"]}>
                    <input type="checkbox" />
                  </td>
                  {columns.map((col) => (
                    <td
                      key={String(col.name)}
                      className={styles["td"]}
                    >
                      {String(row[col.name] ?? resolveInitialValue(col.initialValue))}
                    </td>
                  ))}
                  <td className={styles["td"]}></td>
                </tr>
              ))}
            </tbody>
            <tfoot className={styles["tfoot"]}>
              <tr className={styles["trow"]}>
                <th
                  className={styles["tf"]}
                  colSpan={columns.length + 2}
                >
                  <div className="d-flex flex-row flex-nowrap px-2 py-1">
                    <button
                      className="btn btn-xs btn-outline-light"
                      aria-label="Button to go back one page of results."
                      disabled={page == 0}
                      onClick={() => setPage(page - 1)}
                    >
                      <i
                        className="bi bi-arrow-left"
                        aria-hidden
                      ></i>
                    </button>
                    <span className="mx-auto">
                      {page + 1} of {maxPages}
                    </span>
                    <button
                      className="btn btn-xs btn-outline-light"
                      aria-label="Button to go forward one page of results."
                      disabled={page + 1 >= maxPages}
                      onClick={() => setPage(page + 1)}
                    >
                      <i
                        className="bi bi-arrow-right"
                        aria-hidden
                      ></i>
                    </button>
                  </div>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }

  return {
    Table,
  };
}
