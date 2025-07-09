"use client";

import React from "react";
import SecondParent from "@/app/lesson/life-cycle/SecondParent";
import UseStateNotUpdate from "@/app/lesson/life-cycle/UseStateNotUpdate";

export default function Parent() {
    console.log("parent" + Math.random());

    const [count, setCount] = React.useState(100);

    return (
        <>
      <pre>
        React函数组件的主体（即返回的JSX）会在以下情况下执行：
        <br/>
        组件被首次渲染到DOM中。
        <br/>
        组件的props发生变化，并且这些变化导致了重新渲染。
        <br/>
        组件的状态（state）发生变化，即使相关props没有变化。
        <br/>
        组件的父组件被重新渲染.
        <br/>
        函数组件的主体执行次数通常由以上情况决定，但不是由组件内部的状态或逻辑控制流决定。
        <br/>
      </pre>
            <div>
                Parent
                <SecondParent/>
            </div>

            <div>
                <h1>初始化状态useState 不更新</h1>

                <UseStateNotUpdate count={count}/>
                {count}
                <button onClick={() => setCount(count + 1)}>点击 不会更新子组件的状态</button>
            </div>
        </>
    );
}
