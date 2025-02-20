// @ts-ignore
import md from "./readme.md";
import Markdown from "react-markdown";
import React from "react";

/**
 * The generateStaticParams function can be used in combination with dynamic route segments to statically generate routes at build time instead of on-demand at request time.
 */
export async function generateStaticParams() {
  const ids = ["1", "2", "3"]; // 假设你已知这些id
  return ids.map((id: string) => ({
    id: id
  }));
}

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <Markdown>{md}</Markdown>
      My Post: {params.id}
    </div>
  );
}
