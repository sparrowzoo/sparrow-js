import React from "react";
import Father from "./Father";
import Uncle from "./Uncle";
import MyButton from "./EventButton";
import Gallery from "../component/Profile";

export default function App(properties) {
  return (
    <div style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
      <Gallery />
      <h1>I.Root </h1>
      <h2>my name is:{properties.name}</h2>
      <MyButton name="click me" />
      <Father name={properties.name} />
      <Uncle />
    </div>
  );
}
