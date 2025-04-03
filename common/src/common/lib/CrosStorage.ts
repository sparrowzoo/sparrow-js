import {
  CommandType,
  StorageRequest,
  StorageResponse,
  StorageType,
} from "@/common/lib/protocol/CrosProtocol";
import { STORAGE_PROXY, TOKEN_KEY, TOKEN_STORAGE } from "@/common/lib/Env";

export default class CrosStorage {
  private iframe: HTMLIFrameElement;
  private iframeOrigin: string | undefined;
  private cros: boolean = false;
  private loaded: boolean = false;

  private randomUUID() {
    const hex = '0123456789abcdef';
    let uuid = '';
    for (let i = 0; i < 36; i++) {
      if ([8, 13, 18, 23].includes(i)) uuid += '-';
      else uuid += hex[Math.floor(Math.random() * 16)];
    }
    return uuid;
  }

  private constructor(cros: Boolean | null = null) {
    if (cros === false) {
      return;
    }
    this.cros = STORAGE_PROXY ? true : false;
    if (this.cros == false) {
      return;
    }
    const iframe = document.createElement("iframe");
    iframe.src = STORAGE_PROXY as string;
    iframe.style.display = "none";
    this.iframe = iframe;
    console.log("append iframe " + STORAGE_PROXY);
    iframe.addEventListener("DOMContentLoaded", () => {
      console.log("iframe DOMContentLoaded");
      this.loaded = true;
    });
    iframe.addEventListener("load", () => {
      console.log("iframe loaded");
      this.loaded = true;
    });
    document.body.appendChild(iframe);
    this.iframeOrigin = STORAGE_PROXY;
  }

  public static getCurrentStorage() {
    return new CrosStorage(false);
  }

  public static getCrosStorage() {
    return new CrosStorage();
  }

  public set(
    value: string,
    key: string = TOKEN_KEY,
    storage: StorageType = StorageType.AUTOMATIC
  ) {
    storage = this.getStorageType(storage);
    if (!this.cros) {
      const store =
        storage === StorageType.LOCAL ? localStorage : sessionStorage;
      store.setItem(key, value);
      return Promise.resolve(value);
    }

    return this.request({
      requestId: this.randomUUID(),
      command: CommandType.SET,
      storage: storage,
      key,
      value,
    });
  }

  public get(
    key: string = TOKEN_KEY,
    storage: StorageType = StorageType.AUTOMATIC
  ) {
    storage = this.getStorageType(storage);
    if (!this.cros) {
      const store = storage === "local" ? localStorage : sessionStorage;
      return Promise.resolve(store.getItem(key));
    }
    return this.request({
      requestId: this.randomUUID(),
      command: CommandType.GET,
      storage: storage,
      key,
    });
  }

  public remove(
    key: string = TOKEN_KEY,
    storage: StorageType = StorageType.AUTOMATIC
  ) {
    storage = this.getStorageType(storage);
    if (!this.cros) {
      const store =
        storage === StorageType.LOCAL ? localStorage : sessionStorage;
      const value = store.getItem(key);
      store.removeItem(key);
      return Promise.resolve(value);
    }
    return this.request({
      requestId: this.randomUUID(),
      command: CommandType.REMOVE,
      storage: storage,
      key,
    });
  }

  destroy() {
    document.body.removeChild(this.iframe);
  }

  public async getToken(
    storage: StorageType = StorageType.AUTOMATIC,
    generateVisitorToken: any | null = null
  ) {
    const token = await this.get(TOKEN_KEY, storage);
    if (token) {
      return token;
    }
    if (generateVisitorToken) {
      const visitorToken = await generateVisitorToken();
      await this.setToken(visitorToken);
      return visitorToken;
    }
    return null;
  }

  public setToken(token: string, storage: StorageType = StorageType.AUTOMATIC) {
    return this.set(token, TOKEN_KEY, storage);
  }

  public removeToken(storage: StorageType = StorageType.AUTOMATIC) {
    return this.remove(TOKEN_KEY, storage);
  }

  private getStorageType(storageType: StorageType) {
    if (storageType === StorageType.AUTOMATIC) {
      storageType =
        TOKEN_STORAGE === "SESSION" ? StorageType.SESSION : StorageType.LOCAL;
    }
    return storageType;
  }

  // 发送请求
  private request(req: StorageRequest): Promise<string | null> {
    return new Promise((resolve, reject) => {
      // 监听响应
      const handleMessage = (event: MessageEvent<StorageResponse>) => {
        if (
          !this.iframeOrigin ||
          this?.iframeOrigin?.indexOf(event.origin) < 0 ||
          event.data.requestId !== req.requestId
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

      const send = () => {
        console.log("send request", this.loaded);
        if (!this.loaded) {
          setTimeout(send, 1000);
          return;
        }
        try {
          this.iframe.contentWindow?.postMessage(
            req,
            this.iframeOrigin as string
          );
        } catch (e) {
          setTimeout(send, 1000);
        }
      };
      send();

      // 超时处理
      // setTimeout(() => {
      //   window.removeEventListener("message", handleMessage);
      //   reject(new Error("Request timeout"));
      // }, 5000);
    });
  }
}
