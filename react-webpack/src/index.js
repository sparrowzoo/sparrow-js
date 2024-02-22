import React from "react";
import reactDom from "react-dom";
import App from "./App";

// class App extends React.Component {
//   render() {
//     return <div>hello world</div>;
//   }
// }

// function App(props) {
//   return <h1>Hello, {props.name}</h1>;
// }

reactDom.render(<App name="zhangsan" />, document.getElementById("root"));
