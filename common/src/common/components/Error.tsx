import React from "react";
import UseAnimations from "react-useanimations";
import alertTriangle from "react-useanimations/lib/alertTriangle";

interface ErrorProps {
  error: string;
}

export default function ErrorShower(error: ErrorProps) {
  debugger;
  return (
    <div className="error">
      <div className="inline">
        <UseAnimations animation={alertTriangle} size={56} />
        <span>{error.error}</span>
      </div>
    </div>
  );
}
