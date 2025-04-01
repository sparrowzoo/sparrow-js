"use client";
import { useEffect } from "react";
import CrosStorage from "@/common/lib/CrosStorage";

export default function Page() {
  let crosStorage: CrosStorage | null = null;
  useEffect(() => {
    crosStorage = new CrosStorage();
    return () => {
      if (crosStorage) {
        crosStorage.destroy();
      }
    };
  }, []);

  function handleStorageGetRequest() {
    crosStorage
      ?.set("session", "test", "value")
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
      <button onClick={handleStorageGetRequest}>Set storage value</button>
    </div>
  );
}
