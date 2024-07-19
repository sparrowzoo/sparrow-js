"use client";
import * as Portal from "@radix-ui/react-portal";

export default function Page() {
  return (
    <div>
      <div id="header"></div>
      <Portal.Root asChild={true} container={document.getElementById("header")}>
        content
      </Portal.Root>
    </div>
  );
}
