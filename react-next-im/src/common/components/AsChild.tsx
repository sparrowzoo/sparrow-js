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
            ...child.props,
            className: `${props.className || ""} ${
                child.props.className || ""
            }`.trim(),
        });
    }

    return <div {...props}>{children}</div>;
};

export default ChildComponent;
