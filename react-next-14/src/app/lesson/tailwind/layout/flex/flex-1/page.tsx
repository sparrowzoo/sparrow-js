// @ts-ignore
import md from "./readme.md";
import Markdown from "react-markdown";

export default function Page() {
  return (
    <>
      <Markdown className={"text-left"}>{md}</Markdown>
    </>
  );
}
