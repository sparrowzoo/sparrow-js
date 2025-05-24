"use client";
import { useState } from "react";

function Position() {
  debugger;
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
  });
  return (
    <button
      onClick={(event) => {
        setPosition((pre) => {
          return {
            left: pre.left + 1,
            top: pre.top + 1,
          };
        });
      }}
    >
      Value {position.left}--{position.top}
    </button>
  );
}

function State() {
  const [s1, setS1] = useState(1);

  return (
    <button
      onClick={(event) => {
        setS1((s) => {
          return s + 1;
        });
      }}
    >
      State1 Value {s1}
    </button>
  );
}

export default function Page() {
  const [s2, setS2] = useState(2);
  return (
    <div>
      <Position />
      <State />

      <button
        onClick={(event) => {
          setS2((s) => {
            return s + 1;
          });
        }}
      >
        State2 Value {s2}
      </button>
    </div>
  );
}
