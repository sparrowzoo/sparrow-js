"use client";
import { useEffect } from "react";
import { redirectTo } from "@/common/lib/Navigating";
import { WWW_ROOT } from "@/common/lib/Env";

export default function Page() {
  useEffect(() => {
    redirectTo(`${WWW_ROOT}/hi`);
  });
  return <></>;
}
