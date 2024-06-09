import React from "react";

interface FirstComponentProp {
  title: string;
  content: string;
}

function Li({ content, title }: FirstComponentProp) {
  return (
    <li>
      <h2>{title}</h2>
      <div>{content}</div>
    </li>
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>组件使用说明</h1>
      <ul>
        <Li
          title={"命名"}
          content={
            "React 组件是常规的 JavaScript 函数，但\n        组件的名称必须以大写字母开头，否则它们将无法运行！"
          }
        />
        <Li
          title={"添加标签"}
          content={
            "返回语句可以全写在一行上，如下面组件中所示：\n" +
            "\n" +
            'return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;\n' +
            "但是，如果你的标签和 return 关键字不在同一行，则必须把它包裹在一对括号中，如下所示：\n" +
            "\n" +
            "return (\n" +
            "  <div>\n" +
            '    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />\n' +
            "  </div>\n" +
            ");\n" +
            "陷阱\n" +
            "没有括号包裹的话，任何在 return 下一行的代码都 将被忽略！"
          }
        />
        <Li
          title={"不允许嵌套定义"}
          content={
            "组件可以渲染其他组件，但是 请不要嵌套他们的定义" +
            "当子组件需要使用父组件的数据时，你需要 通过 props 的形式进行传递，而不是嵌套定义。"
          }
        />
      </ul>
    </section>
  );
}
