import React from "react";

interface Condition {
  cond: boolean;
}

function IfCondition({ cond }: Condition) {
  if (cond) {
    return <div>Condition is true</div>;
  }
  return <div>Condition is false</div>;
}

function ConditionExpression({ cond }: Condition) {
  return cond ? (
    <div>Condition expression is true</div>
  ) : (
    <div>Condition expression is false</div>
  );
}

export default function Condition() {
  return (
    <>
      <h1>摘要</h1>

      <div>
        <ul>
          <li>在 React，你可以使用 JavaScript 来控制分支逻辑。</li>
          <li>你可以使用 if 语句来选择性地返回 JSX 表达式。</li>
          <li>
            你可以选择性地将一些 JSX 赋值给变量，然后用大括号将其嵌入到其他 JSX
            中。
          </li>
          <li>
            在 JSX 中，cond ? &lt;A /&gt; : &lt;B /&gt; 表示 “当 cond 为真值时,
            渲染 &lt;A /&gt;，否则 &lt;B /&gt; ”。
          </li>
          <li>
            在 JSX 中，cond && &lt;A /&gt; 表示 “当 cond 为真值时, 渲染 &lt;A
            /&gt;，否则不进行渲染”。
          </li>
          <li>
            快捷的表达式很常见，但如果你更倾向于使用 if，你也可以不使用它们，。
          </li>
        </ul>
      </div>
      <IfCondition cond={true} />
      <IfCondition cond={false} />

      <ConditionExpression cond={true} />
      <ConditionExpression cond={false} />
    </>
  );
}
