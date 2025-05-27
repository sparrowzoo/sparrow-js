import { Context, createContext } from "react";
import AdminBroker from "@/lib/admin/AdminBroker";

export class AdminContextValue {
  public adminBroker: AdminBroker;

  constructor(adminBroker: AdminBroker) {
    this.adminBroker = adminBroker;
  }

  public static create(adminBroker: AdminBroker): AdminContextValue {
    return new AdminContextValue(adminBroker);
  }

  public newReference(): AdminContextValue {
    return new AdminContextValue(this.adminBroker);
  }
}

export const AdminContext: Context<AdminContextValue> = createContext(
  null as any
);
