// https://nextjs.org/docs/app/api-reference/functions/use-search-params
"use client";
import * as React from "react";
import { Suspense } from "react";
import Session from "@/components/Session";
import LoadingSpinner from "@/common/components/LoadingSpinner";
//https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
export default function SessionPage() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense fallback={<LoadingSpinner />}>
      <Session />
    </Suspense>
  );
}
