"use client";
import Link from "next/link";
import * as React from "react";

function P1() {
  return (
    <div>
      <h1>渲染示例</h1>

      <ul>
        <li>nodejs 环境下 layout 不渲染</li>
        <li>nginx 环境下 layout 重渲染</li>
      </ul>
      <Link href="./p1?query=test1">TEST1</Link>
      <br />
      <Link href="./p1?query=test2">TEST2</Link>
    </div>
  );
}

export default function Page() {
  return <P1 />;
}
