"use client";
import { useEffect } from "react";
import { routing } from "@/i18n/routing";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";

export default function IndexPage() {
  useEffect(() => {
    const locate = localStorage.getItem("locale");
    window.location.href = (locate || routing.defaultLocale) + "/dashboard";
  }, []);
  return (
    <>
      <ThreeDotLoading />
    </>
  );
}
