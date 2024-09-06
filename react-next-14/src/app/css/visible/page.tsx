"use client";
import React, { useRef } from "react";

export default function Page() {
  const ref = useRef(null);
  return (
    <div>
      <div>
        <button
          onClick={(e) => {
            const oldVisible = ref.current.style.visibility;
            const visible = oldVisible == "hidden" ? "visible" : "hidden";
            console.log(oldVisible);
            ref.current.style.visibility = visible;
            console.log(ref.current.style.visibility);
          }}
        >
          看不见我visibility
        </button>

        <button
          onClick={(e) => {
            const oldVisible = ref.current.style.display;
            const visible = oldVisible == "none" ? "block" : "none";
            console.log(visible);
            ref.current.style.display = visible;
            console.log(ref.current.style.display);
          }}
        >
          看不见我display
        </button>
      </div>
      <div ref={ref}>
        <form>
          <input type={"text"} />
        </form>
      </div>
    </div>
  );
}
