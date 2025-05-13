"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LoadingSpinner from "@/common/components/LoadingSpinner";
import * as React from "react";
import { Suspense } from "react";

function P1() {
  const searchParams = useSearchParams();

  return (
    <div>
      <h1>{searchParams.get("query")}</h1>
      <Link href="./p1?query=test1">TEST1</Link>
      <br />
      <Link href="./p1?query=test2">TEST2</Link>
    </div>
  );
}

export default function Page() {
  <Suspense fallback={<LoadingSpinner />}>
    <P1 />
  </Suspense>;
}
