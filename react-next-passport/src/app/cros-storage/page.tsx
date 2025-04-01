"use client";
import {useEffect} from "react";
import {CommandType, StorageRequest, StorageResponse, StorageType,} from "@/common/lib/protocol/CrosProtocol";
import {allowOrigin} from "@/common/lib/Env";

export default function Page() {
  useEffect(() => {
    window.addEventListener(
      "message",
      (event: MessageEvent<StorageRequest>) => {
        // 严格验证来源
        if (!allowOrigin(event.origin)) return;
        const storage =
          event.data.storage ===StorageType.LOCAL ? localStorage : sessionStorage;

        console.log("Received message", JSON.stringify(event.data));
        try {
          let value: string | null = null;
          switch (event.data.command) {
            case CommandType.GET:
              value = storage.getItem(event.data.key);
              break;
            case CommandType.SET:
              if (event.data.value) {
                storage.setItem(event.data.key, event.data.value);
                value = event.data.value;
              } else {
                throw new Error("Value is required for set command");
              }
              break;
            case CommandType.REMOVE:
              storage.removeItem(event.data.key);
              break;
          }
          // 发送响应
          const response: StorageResponse = {
            value: value,
            requestId: event.data.requestId,
          };
          event.source?.postMessage(response, { targetOrigin: event.origin });
        } catch (err) {
          const errorResponse: StorageResponse = {
            requestId: event.data.requestId,
            value: null,
            error: err instanceof Error ? err.message : "Unknown error",
          };
          event.source?.postMessage(errorResponse, { targetOrigin: event.origin });
        }
      }
    );
    return () => {
      window.removeEventListener("message", () => {});
      };
  },[]);
  return <></>;
}
