import { TableCell, TableRow } from "@/components/ui/table";
import * as React from "react";
import { EmptyRowProps } from "@/lib/DataTableProperty";

export function EmptyRow<TData, TValue>({
  columns,
}: EmptyRowProps<TData, TValue>) {
  return (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  );
}
