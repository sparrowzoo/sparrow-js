import React from "react";

interface ItemProp {
  href: string;
  title: string;
}

function Item({ href, title }: ItemProp) {
  return (
    <li>
      <a href={href}>{title}</a>
    </li>
  );
}

export default function Index() {
  return (
    <>
      <h1>React 14教程</h1>
      <section>
        <p>TypeScript参考文档</p>
        <p>
          <a href="https://react.docschina.org/learn/typescript">
            React使用TypeScript
          </a>
          <br />
          <a href="https://www.typescriptlang.org/docs/handbook/2/objects.html">
            TypeScript 类型定义
          </a>
        </p>
        <Item href={"lesson/component"} title={"最简单的组件示例"} />
      </section>
    </>
  );
}
