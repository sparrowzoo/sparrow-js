import React, { useState } from "react";
import store from "../store/index";

export default function Uncle() {
  const [n, setState] = useState(0);
  store.subscribe(() => {
    setState(store.getState);
  });

  return (
    <div style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
      Uncle组件 {store.getState()}
      <button
        onClick={() => {
          store.dispatch({ type: "sub" });
          setState(store.getState);
        }}
      >
        -1
      </button>
    </div>
  );
}
