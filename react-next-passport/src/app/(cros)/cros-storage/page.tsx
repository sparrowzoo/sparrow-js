"use client";
import { useEffect } from "react";
import {
  CommandType,
  StorageRequest,
  StorageResponse,
  StorageType,
} from "@/common/lib/protocol/CrosProtocol";
import { allowOrigin } from "@/common/lib/Env";
import { Utils } from "@/common/lib/Utils";
import UrlUtils from "@/common/lib/UrlUtils";

export default function Page() {
  useEffect(() => {
    console.info("init cros iframe storage");
    if (window.parent === window) {
      console.log("window.opener is null");
      return;
    }
    window.addEventListener(
      "message",
      (event: MessageEvent<StorageRequest>) => {
        console.log("Received message", JSON.stringify(event.data));
        // 严格验证来源
        if (!allowOrigin(event.origin)) return;
        const storage =
          event.data.storage === StorageType.LOCAL
            ? localStorage
            : sessionStorage;
        debugger;
        console.log("Received allow origin", JSON.stringify(event.data));
        try {
          let value: string | null = null;
          switch (event.data.command) {
            case CommandType.GET:
              value = storage.getItem(event.data.key as string);
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
          console.log(
            "iframe Sending response to parent ",
            JSON.stringify(response)
          );
          event.source?.postMessage(response, { targetOrigin: event.origin });
        } catch (err) {
          console.error("iframe Error occurred while processing request", err);
          const errorResponse: StorageResponse = {
            requestId: event.data.requestId,
            value: null,
            error: err instanceof Error ? err.message : "Unknown error",
          };
          event.source?.postMessage(errorResponse, {
            targetOrigin: event.origin,
          });
        }
      }
    );

    function sendReadyEvent() {
      console.log("Sending ready event to parent");
      const req: StorageRequest = {
        storage: StorageType.AUTOMATIC,
        requestId: Utils.randomUUID(),
        key: "cros-iframe-storage",
        command: CommandType.INIT,
      };
      const parentUrl = UrlUtils.getQueryString();
      if (!parentUrl) {
        console.error("Failed to get parent URL");
        return;
      }
      const send = () => {
        try {
          //这里窗口和URl需要保持一致
          window.parent.postMessage(req, parentUrl as string);
        } catch (e) {
          setTimeout(send, 100);
        }
      };
      send();
    }

    sendReadyEvent();
    return () => {
      console.info("unmount cros iframe storage");
    };
  }, []);
  return (
    <html>
      <body></body>
    </html>
  );
}
