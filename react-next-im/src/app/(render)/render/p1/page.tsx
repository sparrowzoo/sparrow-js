"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Page() {
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
