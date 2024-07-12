// @ts-ignore
import top from "./container.md";
// @ts-ignore
import custom from "./custom.md";
import Markdown from "react-markdown";
import React from "react";

export default function AspectRatio() {
  return (
    <div>
      <Markdown>{top}</Markdown>
      <div className="container border-2  border-sky-500">
        <div className="container w-3/5">默认无法居中？</div>
      </div>
      <div className="container mx-auto border-2  border-sky-500">
        <div className="container w-3/5 mx-auto">mx-auto 可居中</div>
      </div>

      <Markdown>{custom}</Markdown>
    </div>
  );
}
