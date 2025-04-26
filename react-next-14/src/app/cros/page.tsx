"use client";
import ChatApi from "@/api/ChatApi";
import { StorageType } from "@/common/lib/protocol/CrosProtocol";
import useCrosStorage from "@/common/hook/CrosStorageHook";

export default function Page() {
  const crosStorage = useCrosStorage();

  function setStorageValue() {
    crosStorage
      ?.set(
        "Hello, world!" + new Date().toLocaleString(),
        "test",
        StorageType.SESSION
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function getStorageValue() {
    crosStorage
      ?.get("test", StorageType.SESSION)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function getToken() {
    crosStorage
      ?.getToken(StorageType.AUTOMATIC, () => ChatApi.getVisitorToken())
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function setToken() {
    crosStorage
      ?.setToken("tokenlkjlkj" + new Date().toLocaleString())
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <h1>Cros Storage Demo</h1>
      <p>This is a demo page for Cros Storage integration with Next.js</p>
      <button onClick={setStorageValue}>Set storage value</button>
      <button onClick={getStorageValue}>Get storage value</button>

      <button onClick={setToken}>Set Token value</button>
      <button onClick={getToken}>Get Token value</button>
    </div>
  );
}
