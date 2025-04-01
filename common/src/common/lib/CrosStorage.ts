import {CommandType, StorageRequest, StorageResponse, StorageType,} from "@/common/lib/protocol/CrosProtocol";
import {NEXT_PUBLIC_STORAGE_PROXY, TOKEN_KEY, TOKEN_STORAGE} from "@/common/lib/Env";

export default class CrosStorage {
  private iframe: HTMLIFrameElement;
  private iframeOrigin: string | undefined;
  private cros: boolean = false;

  public static getCurrentStorage() {
    return new CrosStorage(false);
  }

  public static getCrosStorage() {
    return new CrosStorage();
  }

  private constructor(cros: Boolean|null =null) {
    if (!cros) {
      cros=NEXT_PUBLIC_STORAGE_PROXY?true:false;
    }
    if (cros) {
      this.cros = true;
      const iframe = document.createElement("iframe");
      iframe.src = NEXT_PUBLIC_STORAGE_PROXY as string;
      iframe.style.display = "none";
      this.iframe = iframe;
      document.body.appendChild(iframe);
      this.iframeOrigin = NEXT_PUBLIC_STORAGE_PROXY;
    }
  }

  public set(storage: StorageType, key: string, value: string) {
    storage=this.getStorage(storage);
    if (!this.cros) {
      const store = storage === "local" ? localStorage : sessionStorage;
      store.setItem(key, value);
      return Promise.resolve(value);
    }

    return this.request({
      requestId: crypto.randomUUID(),
      command: CommandType.SET,
      storage: storage,
      key,
      value,
    });
  }

  public get(storage: StorageType, key: string) {
    storage=this.getStorage(storage);

    if (!this.cros) {
      const store = storage === "local" ? localStorage : sessionStorage;
      return Promise.resolve(store.getItem(key));
    }
    return this.request({
      requestId: crypto.randomUUID(),
      command: CommandType.GET,
      storage: storage,
      key,
    });
  }

  private getStorage(storage: StorageType) {
    if(storage === StorageType.AUTOMATIC){
      storage=(TOKEN_STORAGE === "SESSION" ? StorageType.SESSION:StorageType.LOCAL)
    }
    return storage;
  }
  public remove(storage: StorageType, key: string) {
    storage=this.getStorage(storage);
    if (!this.cros) {
      const store = storage === StorageType.LOCAL ? localStorage : sessionStorage;
      const value = store.getItem(key);
      store.removeItem(key);
      return Promise.resolve(value);
    }
    return this.request({
      requestId: crypto.randomUUID(),
      command: CommandType.REMOVE,
      storage: storage,
      key,
    });
  }

  destroy() {
    document.body.removeChild(this.iframe);
  }

  public async getToken(storage: StorageType=StorageType.AUTOMATIC, generateVisitorToken:any|null=null) {
    if(storage === StorageType.AUTOMATIC){
      storage=(TOKEN_STORAGE === "SESSION" ? StorageType.SESSION:StorageType.LOCAL)
    }
    const token = await this.get(storage, TOKEN_KEY);
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

  public setToken(token: string,storage: StorageType=StorageType.AUTOMATIC) {
    if(storage === StorageType.AUTOMATIC){
      storage=(TOKEN_STORAGE === "SESSION" ? StorageType.SESSION:StorageType.LOCAL)
    }
    return this.set(storage, TOKEN_KEY, token);
  }


  public removeToken(storage: StorageType) {
    return this.remove(storage, TOKEN_KEY);
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
      this.iframe.contentWindow?.postMessage(req, this.iframeOrigin as string);
      // 超时处理
      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        reject(new Error("Request timeout"));
      }, 5000);
    });
  }
}
