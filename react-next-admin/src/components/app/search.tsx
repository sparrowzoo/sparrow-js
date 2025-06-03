import { Input } from "@/components/ui/input";
import * as React from "react";
import { Payment } from "@/components/menu/columns";
import { SearchProps } from "@/lib/DataTableProperty";

export default function Search({ table }: SearchProps<Payment>) {
  return (
    <Input
      placeholder="Filter emails..."
      value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn("email")?.setFilterValue(event.target.value)
      }
      className="max-w-sm"
    />
  );
}
