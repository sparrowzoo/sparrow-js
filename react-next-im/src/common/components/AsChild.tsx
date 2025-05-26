"use client";
import React, { cloneElement } from "react";

type ChildProps = {
  asChild?: boolean;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<"div">;

const ChildComponent = ({
  asChild = false,
  children,
  ...props
}: ChildProps) => {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement;

    return cloneElement(child, {
      ...props,
      // @ts-ignore
      ...child.props,
      className: `${props.className || ""} ${
        // @ts-ignore
        child.props.className || ""
      }`.trim(),
    });
  }

  return <div {...props}>{children}</div>;
};

export default ChildComponent;
