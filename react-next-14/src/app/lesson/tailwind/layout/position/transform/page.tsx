// @ts-ignore
import readme from "./readme.md";
import Markdown from "react-markdown";
import React from "react";

export default function Page() {
  return (
    <div className={"text-left"}>
      <div
        className="mid"
        style={{
          border: "1px solid black",
          width: "300px",
          height: "300px",
          position: "fixed",
          top: "300px",
          left: "300px",
          transform: "translate(100px, 100px)",
        }}
      >
        <div
          style={{ border: "1px solid red", width: "100px", height: "100px" }}
        >
          <div
            className="inner"
            style={{
              border: "1px solid black",
              position: "fixed",
              top: "10px",
              left: "10px",
            }}
          >
            <p>Transform 控制自已，同时控制子(跨多级)元素fixed定位</p>
          </div>
        </div>
      </div>

      <div
        className="mid"
        style={{
          border: "1px solid black",
          width: "300px",
          height: "300px",
          position: "fixed",
          top: "300px",
          left: "300px",
        }}
      >
        <div
          className="inner"
          style={{
            border: "1px solid black",
            position: "fixed",
            top: "10px",
            left: "10px",
          }}
        >
          <p>Transform 我相对窗口</p>
        </div>
      </div>
      <Markdown>{readme}</Markdown>
    </div>
  );
}
