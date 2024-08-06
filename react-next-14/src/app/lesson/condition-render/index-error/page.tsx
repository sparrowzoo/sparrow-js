"use client";
import { useState } from "react";

function Com1() {
  const [state, setState] = useState<number>(0);
  return (
    <>
      <button
        onClick={() => {
          setState(state + 1);
        }}
      >
        我是老大 {state}
      </button>
    </>
  );
}

function Com2() {
  const [state, setState] = useState<number>(0);
  return (
    <>
      <button
        onClick={() => {
          setState(state + 1);
        }}
      >
        我是老二 {state}
      </button>
    </>
  );
}

export default function Page() {
  const [state, setState] = useState<boolean>(false);
  return (
    <>
      <div>
        <button
          onClick={() => {
            setState(!state);
          }}
        >
          change state
        </button>
        <br />
        {state ? <Com1 /> : <Com2 />}
      </div>
    </>
  );
}
