"use client";
import * as React from "react";

export default function Root({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("Root component rendered");
  return <div> layout {children}</div>;
}
