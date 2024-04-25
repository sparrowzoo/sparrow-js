import React from "react";
import App from "./App";
//过时的API
import ReactDom from "react-dom";

const Vdom =
    React.createElement("h1", {id: "recipe", 'data-type': "title"}, "Hello World2222!")

//ReactDom.render(Vdom, document.getElementById("root"));
//ReactDom.render(<App/>, document.getElementById("root"));
//ReactDom.render(<h2>Hello</h2>, document.getElementById("root"));

// 新的API
import {createRoot} from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App/>)
