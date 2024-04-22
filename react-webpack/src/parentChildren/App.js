import React from "react";
import {
  BrowserRouter,
  HashRouter,
  Link,
  MemoryRouter,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import Father from "./Father";
import Uncle from "./Uncle";
import MyButton from "./EventButton";

export default function App(properties) {
  return (
    <div style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
      <h1>I.Root </h1>
      <h2>
        my name is:{properties.name}
      </h2>
      <MyButton name="click me" />
      <Father name={properties.name} />
      <Uncle />
    </div>
  );
}
