"use client";
import React from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import MockRadix from "@/app/lesson/valibot/checkbox-shadcn/pass-children/MockRadix";
import CheckStatusContext from "@/app/lesson/valibot/checkbox-shadcn/CheckBoxContext";

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<"button">;

function RadixCheckboxWithOutChildren({ ...props }: PrimitiveButtonProps) {
  return <button className="radix-checkbox" {...props} />;
}

function RadixCheckbox({ children, ...props }: PrimitiveButtonProps) {
  return (
    <button className="radix-checkbox" {...props}>
      {children}
    </button>
  );
}

function Indicator() {
  return (
    <span className="indicator">
      <CheckIcon />
    </span>
  );
}

export default function Page() {
  return (
    <div>
      <h1>Checkbox with Shadow DOM</h1>
      <CheckStatusContext.Provider value={true}>
        <RadixCheckbox>
          <Indicator />
        </RadixCheckbox>
      </CheckStatusContext.Provider>
      <MockRadix>
        <Indicator />
      </MockRadix>

      <RadixCheckbox>
        <Indicator />
      </RadixCheckbox>

      <RadixCheckboxWithOutChildren>
        <Indicator />
      </RadixCheckboxWithOutChildren>
    </div>
  );
}
