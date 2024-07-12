// @ts-ignore
import md from "./readme.md";
import Markdown from "react-markdown";
import React from "react";

export async function generateStaticParams() {
  const ids = ["1", "2", "3"]; // 假设你已知这些id
  return ids.map((id: string) => ({
    id: id,
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
