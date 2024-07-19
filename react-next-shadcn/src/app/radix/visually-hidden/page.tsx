import * as React from "react";
import * as VisuallyHiddenPrimitive from "@radix-ui/react-visually-hidden";

export default function Page() {
  return (
    <div>
      You won't see this:
      <VisuallyHiddenPrimitive.Root>🙈</VisuallyHiddenPrimitive.Root>
      <VisuallyHiddenPrimitive.VisuallyHidden></VisuallyHiddenPrimitive.VisuallyHidden>
    </div>
  );
}
