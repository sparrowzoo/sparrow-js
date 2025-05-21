"use client";
import { useEffect } from "react";
import useNavigating from "@/common/hook/NavigatingHook";

export default function Page() {
  const Navigations = useNavigating();
  useEffect(() => {
    Navigations.redirectToIndex();
  }, []);
  return <></>;
}
