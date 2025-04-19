import { Context, createContext } from "react";
import MessageBroker from "@/lib/im/MessageBroker";

/**
 * 为status 的引用发生变化引发渲染
 */
export class WebSocketContextValue {
  messageBroker: MessageBroker;

  private constructor(messageContainer: MessageBroker) {
    this.messageBroker = messageContainer;
  }

  public static create(messageContainer: MessageBroker): WebSocketContextValue {
    return new WebSocketContextValue(messageContainer);
  }

  public newReference(): WebSocketContextValue {
    return new WebSocketContextValue(this.messageBroker);
  }

  public closeWebSocket(): void {
    this.messageBroker?.closeWebSocket();
  }
}

export const WebSocketContext: Context<WebSocketContextValue> = createContext(
  null as any
);
