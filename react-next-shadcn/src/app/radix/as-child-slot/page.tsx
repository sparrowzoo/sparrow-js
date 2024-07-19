import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

function Button({
  asChild,
  ...props
}: {
  asChild?: boolean;
  [key: string]: any;
}) {
  const Comp = asChild ? Slot : "button";
  return <Comp {...props} />;
}

export default function Page() {
  return (
    <Button asChild className="bg-background text-red-500">
      <a href="/contact">Contact</a>
    </Button>
  );
}
