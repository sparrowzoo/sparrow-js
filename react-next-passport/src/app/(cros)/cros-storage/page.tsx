"use client";

import {useEffect} from "react";
import {CommandType, StorageRequest, StorageResponse, StorageType} from "@/common/lib/protocol/CrosProtocol";
import {allowOrigin, TOKEN_STORAGE} from "@/common/lib/Env";
import {Utils} from "@/common/lib/Utils";

/** The iframe is a static, unlocalized page; storage access runs in the browser. */
export default function Page() {
  useEffect(() => {
    if (window.parent === window) return;

    let parentOrigin: string;
    try {
      // New clients encode their origin; existing clients sent a raw parent URL.
      parentOrigin = new URL(decodeURIComponent(window.location.search.slice(1))).origin;
    } catch {
      return;
    }
    if (!allowOrigin(parentOrigin)) return;

    const handleMessage = (event: MessageEvent<unknown>) => {
      if (event.source !== window.parent || event.origin !== parentOrigin || !allowOrigin(event.origin)) return;
      if (!event.data || typeof event.data !== "object") return;

      const request = event.data as Partial<StorageRequest>;
      if (typeof request.requestId !== "string" || typeof request.key !== "string") return;
      if (![CommandType.GET, CommandType.SET, CommandType.REMOVE].includes(request.command as CommandType)) return;
      if (![StorageType.LOCAL, StorageType.SESSION, StorageType.AUTOMATIC].includes(request.storage as StorageType)) return;

      const response: StorageResponse = {requestId: request.requestId, value: null};
      try {
        const local = request.storage === StorageType.LOCAL ||
          (request.storage === StorageType.AUTOMATIC && TOKEN_STORAGE !== "SESSION");
        const storage = local ? window.localStorage : window.sessionStorage;
        switch (request.command) {
          case CommandType.GET:
            response.value = storage.getItem(request.key);
            break;
          case CommandType.SET:
            if (typeof request.value !== "string") throw new Error("Value is required for set command");
            storage.setItem(request.key, request.value);
            response.value = request.value;
            break;
          case CommandType.REMOVE:
            response.value = storage.getItem(request.key);
            storage.removeItem(request.key);
            break;
        }
      } catch (error) {
        response.error = error instanceof Error ? error.message : "Storage unavailable";
      }
      window.parent.postMessage(response, parentOrigin);
    };

    window.addEventListener("message", handleMessage);
    const ready: StorageRequest = {
      storage: StorageType.AUTOMATIC,
      requestId: Utils.randomUUID(),
      key: "cros-iframe-storage",
      command: CommandType.INIT,
    };
    window.parent.postMessage(ready, parentOrigin);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}
