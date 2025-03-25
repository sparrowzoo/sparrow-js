import { Context, createContext } from "react";
import SparrowWebSocket from "@/lib/SparrowWebSocket";

export const WebSocketContext: Context<any> = createContext(
  null as SparrowWebSocket | null
);
