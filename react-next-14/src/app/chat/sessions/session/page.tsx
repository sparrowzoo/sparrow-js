// https://nextjs.org/docs/app/api-reference/functions/use-search-params
"use client";
import { Suspense } from "react";
import Session from "@/components/Session";
//https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
export default function SessionPage() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <Session />
    </Suspense>
  );
}
