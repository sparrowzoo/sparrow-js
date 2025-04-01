"use client";
import { useEffect } from "react";
import CrosStorage from "@/common/lib/CrosStorage";

export default function Page() {
  let crosStorage: CrosStorage | null = null;
  useEffect(() => {
    debugger;
    crosStorage = new CrosStorage();
    return () => {
      crosStorage?.destroy();
    };
  }, []);

  function handleStorageRequest() {
    crosStorage
      ?.set("session", "test", "Hello, world!")
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
      <button onClick={handleStorageRequest}>Set storage value</button>
    </div>
  );
}
