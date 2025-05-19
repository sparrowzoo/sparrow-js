"use client";
import { useEffect } from "react";
import { redirectToIndex } from "@/common/lib/Navigating";

export default function Page() {
  useEffect(() => {
    redirectToIndex();
  }, []);
  return <></>;
}
