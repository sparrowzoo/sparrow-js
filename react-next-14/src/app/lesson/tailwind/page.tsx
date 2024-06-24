"use client"
import React from "react";
import "./tailwind.css";

export default function Cups() {
    return (
        <>
        <br/>
       <h2>utility-first 优先级最高</h2>
       <p>https://tailwindcss.com/docs/utility-first</p>

       <br/>
       <h2>base 兜底优先级最低</h2>
       <p>https://tailwindcss.com/docs/preflight</p>
       <br/>
       <h2>components 优先级居中</h2>
       <br/>
       <h2>函数和指令说明</h2>

<p>https://tailwindcss.com/docs/functions-and-directives</p>
       <p className="content">
       使用说明文档 https://www.tailwindcss.cn/docs/installation 



其中 tailwind base 相当于一份重置样式表，包含了最基础的样式。
 tailwind components 包含了一些组件类， 组件相当于复合样式，
 tailwind utilities 包含了工具类，也就是 flex mx-auto 这些内置样式。
这么划分的原因是因为 css 的优先级规则，tailwindcss 全部都是一级样式，
在类名权重相等的情况，下面的样式可以覆盖上面的样式，
所以工具类优先，
组件类次之，
基础样式兜底，生成的样式顺序尤为重要，所以 上面三句指令的顺序非必须建议不要修改。
       </p>
       </>
    );
}
