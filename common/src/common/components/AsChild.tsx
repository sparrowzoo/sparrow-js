"use client";
import React, { cloneElement } from "react";

type ChildProps = {
  asChild?: boolean;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
} & React.ComponentPropsWithoutRef<"div">;

const ChildComponent = ({
  asChild = false,
  children,
  ref,
  ...props
}: ChildProps) => {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement;

    return cloneElement(child, {
      ...props,
      // @ts-ignore
      ...child.props,
      ref,
      className: `${props.className || ""} ${
        // @ts-ignore
        child.props.className || ""
      }`.trim(),
    });
  }

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} {...props}>
      {children}
    </div>
  );
};

export default ChildComponent;
