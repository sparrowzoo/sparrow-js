"use client";
import {
  CommandType,
  StorageRequest,
  StorageResponse,
  StorageType,
} from "@/common/lib/protocol/CrosProtocol";
import { STORAGE_PROXY, TOKEN_KEY, TOKEN_STORAGE } from "@/common/lib/Env";
import { Utils } from "@/common/lib/Utils";
import UrlUtils from "@/common/lib/UrlUtils";
import { redirectToLogin } from "@/common/lib/Navigating";
import LoginUser from "@/common/lib/protocol/LoginUser";

export default class CrosStorage {
  private iframe: HTMLIFrameElement;
  private iframeOrigin: string | undefined = STORAGE_PROXY;
  private cros: boolean = false;
  private loaded: boolean = false;

  private constructor() {
    if (typeof window === "undefined") {
      return;
    }
    console.log("cros storage ");
    this.cros = UrlUtils.isCros(window.location.href, STORAGE_PROXY as string);
    if (!this.cros) {
      return;
    }
    this.initFrame();
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
      requestId: Utils.randomUUID(),
      command: CommandType.SET,
      storage: storage,
      key: key,
      value: value,
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
      requestId: Utils.randomUUID(),
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
      requestId: Utils.randomUUID(),
      command: CommandType.REMOVE,
      storage: storage,
      key,
    });
  }

  destroy() {
    if (this.cros && document.body.contains(this.iframe)) {
      document.body.removeChild(this.iframe);
    }
  }

  public async getToken(
    storage: StorageType = StorageType.AUTOMATIC,
    generateVisitorToken:
      | (() => Promise<string>)
      | null
      | "REDIRECT-TO-LOGIN" = null
  ) {
    return new Promise<any>((resolve, reject) => {
      this.get(TOKEN_KEY, storage).then((token) => {
        if (token) {
          console.log(" token exist ", token);
          return resolve(token);
        }
        if (!generateVisitorToken) {
          console.log("no token found");
          return resolve(null);
        }
        if (generateVisitorToken === "REDIRECT-TO-LOGIN") {
          redirectToLogin();
          return null;
        }
        generateVisitorToken().then((visitorToken) => {
          this.setToken(visitorToken).then(() => {
            console.log("generate visitor token", visitorToken);
            resolve(visitorToken);
          });
        });
      });
    });
  }

  public setToken(token: string, storage: StorageType = StorageType.AUTOMATIC) {
    return this.set(token, TOKEN_KEY, storage);
  }

  public removeToken(storage: StorageType = StorageType.AUTOMATIC) {
    return this.remove(TOKEN_KEY, storage);
  }

  //用户基本信息本地化
  public async locateToken(token = null) {
    if (token) {
      return LoginUser.localize(token);
    }
    //如果不是cros环境，则不进行本地化
    if (!this.cros) {
      return null;
    }
    //这里可能存在之前本地化的token
    // const locationUser = sessionStorage.getItem(USER_INFO_KEY);
    // if (locationUser) {
    //   console.log("location user exist ", locationUser);
    //   return LoginUser.parseLoginJSON(locationUser);
    // }
    return await this.getToken().then((token) => {
      console.log("get cros token ", token);
      if (token) {
        return LoginUser.localize(token);
      }
      return LoginUser.visitor();
    });
  }

  private resetIframe() {
    this.destroy();
    this.initFrame();
  }

  private initFrame() {
    let iframe: HTMLIFrameElement | null = document.querySelector(
      "#cros-storage-iframe"
    );
    if (iframe == null) {
      console.log("create iframe and append to body " + STORAGE_PROXY);
      iframe = document.createElement("iframe");
      iframe.src = STORAGE_PROXY as string;
      iframe.src = iframe.src + "?" + UrlUtils.getHrefWithoutQueryString();
      iframe.style.display = "none";
      iframe.id = "cros-storage-iframe";

      const handleMessage = (event: MessageEvent<StorageRequest>) => {
        console.log("receive message from iframe", event.data);
        if (
          !this.iframeOrigin ||
          this.iframeOrigin?.indexOf(event.origin) < 0
        ) {
          return;
        }
        this.loaded = true;
        iframe?.setAttribute("loaded", "true");
        window.removeEventListener("message", handleMessage); // 清理监听
      };
      window.addEventListener("message", handleMessage);
      document.body.appendChild(iframe);
    } else {
      //存在，并没有ready 所以写之后无法回调
      const localIframe = iframe;
      const timer = setInterval(() => {
        if (localIframe.getAttribute("loaded") === "true") {
          clearInterval(timer);
          this.loaded = true;
        }
      }, 100);
    }
    this.iframe = iframe;
    // iframe.addEventListener("DOMContentLoaded", () => {
    //   console.log("iframe DOMContentLoaded");
    //   this.loaded = true;
    // });
    // iframe.addEventListener("load", () => {
    //   console.log("iframe loaded");
    //   this.loaded = true;
    // });
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
          this.iframeOrigin?.indexOf(event.origin) < 0 ||
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
          if (!this.iframe.contentWindow) {
            this.resetIframe();
          }
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
