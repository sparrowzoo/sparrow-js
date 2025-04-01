import {
  StorageRequest,
  StorageResponse,
  StorageType,
} from "@/common/lib/protocol/CrosProtocol";
import { NEXT_PUBLIC_STORAGE_PROXY, TOKEN_KEY } from "@/common/lib/Env";

export default class CrosStorage {
  private iframe: HTMLIFrameElement;
  private iframeOrigin: string | undefined;
  private cros: boolean = false;

  constructor() {
    if (NEXT_PUBLIC_STORAGE_PROXY) {
      this.cros = true;
      const iframe = document.createElement("iframe");
      iframe.src = NEXT_PUBLIC_STORAGE_PROXY as string;
      iframe.style.display = "none";
      this.iframe = iframe;
      document.body.appendChild(iframe);
      this.iframeOrigin = NEXT_PUBLIC_STORAGE_PROXY;
      return;
    }
  }

  public set(storage: StorageType, key: string, value: string) {
    if (!this.cros) {
      const store = storage === "local" ? localStorage : sessionStorage;
      store.setItem(key, value);
      return Promise.resolve(value);
    }

    return this.request({
      requestId: crypto.randomUUID(),
      command: "set",
      storage: storage,
      key,
      value,
    });
  }

  public get(storage: StorageType, key: string) {
    if (!this.cros) {
      const store = storage === "local" ? localStorage : sessionStorage;
      return Promise.resolve(store.getItem(key));
    }
    return this.request({
      requestId: crypto.randomUUID(),
      command: "get",
      storage: storage,
      key,
    });
  }

  public remove(storage: StorageType, key: string) {
    if (!this.cros) {
      const store = storage === "local" ? localStorage : sessionStorage;
      const value = store.getItem(key);
      store.removeItem(key);
      return Promise.resolve(value);
    }
    return this.request({
      requestId: crypto.randomUUID(),
      command: "remove",
      storage: storage,
      key,
    });
  }

  destroy() {
    document.body.removeChild(this.iframe);
  }

  public getToken(storage: StorageType) {
    return this.get(storage, TOKEN_KEY);
  }

  public setToken(storage: StorageType, token: string) {
    return this.set(storage, TOKEN_KEY, token);
  }

  public removeToken(storage: StorageType) {
    return this.remove(storage, TOKEN_KEY);
  }

  // 发送请求
  private request(req: StorageRequest): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const requestId = crypto.randomUUID(); // 生成唯一ID
      // 监听响应
      const handleMessage = (event: MessageEvent<StorageResponse>) => {
        if (
          event.origin !== this.iframeOrigin ||
          event.data.requestId !== requestId
        )
          return;

        window.removeEventListener("message", handleMessage); // 清理监听

        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          resolve(event.data.value);
        }
      };
      window.addEventListener("message", handleMessage);
      this.iframe.contentWindow?.postMessage(req, this.iframeOrigin as string);
      // 超时处理
      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        reject(new Error("Request timeout"));
      }, 5000);
    });
  }
}
