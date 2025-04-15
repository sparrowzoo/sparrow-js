import { Check, X } from "lucide-react";
import Markdown from "markdown-to-jsx";
import * as React from "react";

interface BadCaseShowerProps {
  right: string;
  wrong: string;
  markdown: string;
}

export default function BadCaseShower(props: BadCaseShowerProps) {
  return (
    <div className={"flex flex-col gap-6 items-center justify-between mb-2"}>
      <span className={"inline-block"}>
        <Check /> <label>{props.right}</label>
      </span>

      <span className={"inline-block"}>
        <X />
        <label>{props.wrong}</label>
      </span>
      <h1>ERROR message</h1>
      <Markdown>{props.markdown}</Markdown>
    </div>
  );
}
