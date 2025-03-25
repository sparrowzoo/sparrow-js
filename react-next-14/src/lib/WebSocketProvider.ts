import { Context, createContext } from "react";
import SparrowWebSocket from "@/lib/SparrowWebSocket";

export interface WebSocketProviderProps {
    sparrowWebSocket:SparrowWebSocket,
    messageNo:number
}
export const WebSocketContext: Context<WebSocketProviderProps> = createContext(null as any);