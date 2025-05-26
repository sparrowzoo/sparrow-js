import { Context, createContext } from "react";
import AccessHistoryContainer from "@/lib/admin/AccessHistoryContainer";


export class AdminContextValue {
  public accessHistoryContainer: AccessHistoryContainer;

  private constructor(accessHistoryContainer: AccessHistoryContainer) {
    this.accessHistoryContainer = accessHistoryContainer;
  }

  public static create(accessHistoryContainer: AccessHistoryContainer): AdminContextValue {
    return new AdminContextValue(accessHistoryContainer);
  }

  public newReference(): AdminContextValue {
    return new AdminContextValue(this.accessHistoryContainer);
  }
}

export const AdminContext: Context<AdminContextValue> = createContext(
  null as any
);
