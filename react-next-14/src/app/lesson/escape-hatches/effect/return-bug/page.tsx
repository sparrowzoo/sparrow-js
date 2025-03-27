"use client";
import { useEffect } from "react";

export default function Page() {
  const sessionKey = undefined;
  useEffect(() => {
    if (!sessionKey) {
      return;
    }
    console.log("sessionKey:", sessionKey);
  }, [sessionKey]);
  return (
    <div>
      <h1>Return Bug</h1>
    </div>
  );
}
