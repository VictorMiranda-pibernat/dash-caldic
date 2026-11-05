
import type { ReactNode } from "react";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  maxHeight?: string;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  maxHeight = "480px",
  emptyMessage = "Nenhum registro encontrado.",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#292B34] bg-[#181920]">
      <div className="overflow-x-auto">
        <div
          className="overflow-y-auto"
          style={{ maxHeight }}
        >
          <table className="w-full min-w-max border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-[#20212A]">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    style={{ width: column.width }}
                    className={`whitespace-nowrap border-b border-[#292B34] px-5 py-4 font-medium text-gray-400 ${
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                          ? "text-right"
                          : "text-left"
                    }`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#292B34]">
              {data.length > 0 ? (
                data.map((row) => (
                  <tr
                    key={rowKey(row)}
                    className="transition-colors hover:bg-[#22232D]"
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`whitespace-nowrap px-5 py-4 text-gray-300 ${
                          column.align === "center"
                            ? "text-center"
                            : column.align === "right"
                              ? "text-right"
                              : "text-left"
                        }`}
                      >
                        {column.render
                          ? column.render(row)
                          : String(
                              (row as Record<string, unknown>)[
                                String(column.key)
                              ] ?? "-"
                            )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#292B34] px-5 py-3">
        <span className="text-xs text-gray-500">
          {data.length} registros
        </span>

        <span className="text-xs text-gray-500">
          Role para visualizar os demais registros
        </span>
      </div>
    </div>
  );


}

