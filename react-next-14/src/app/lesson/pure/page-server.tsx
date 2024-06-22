import React from "react";

let guest = 0;

function Cup() {
    // Bad: changing a preexisting variable!
    guest = guest + 1;
    return <h2>Tea cup for guest #{guest}</h2>;
}

function PureCup() {
    // Bad: changing a preexisting variable!
    return <h2>Pure Tea cup for guest #{guest}</h2>;
}

export default function Cups() {
    return (
        <>
            <h1 style={{color: "red"}}>为什么刷新后 变量的值依然在？为什么没有清0(存储在服务器端)</h1>
            <h1>为什么React 要遵循pure function</h1>
            <p>
                编写纯函数需要遵循一些习惯和规程。但它开启了绝妙的机遇：
                <br/>
                你的组件可以在不同的环境下运行 —
                例如，在服务器上！由于它们针对相同的输入，总是返回相同的结果，因此一个组件可以满足多个用户请求。
                <br/>
                你可以为那些输入未更改的组件来
                跳过渲染，以提高性能。这是安全的做法，因为纯函数总是返回相同的结果，所以可以安全地缓存它们。
                <br/>
                如果在渲染深层组件树的过程中，某些数据发生了变化，React
                可以重新开始渲染，而不会浪费时间完成过时的渲染。纯粹性使得它随时可以安全地停止计算。
                <br/>
                我们正在构建的每个 React
                新特性都利用到了纯函数。从数据获取到动画再到性能，保持组件的纯粹可以充分释放
                React 范式的能力。
                <br/>
            </p>
            <Cup/>
            <Cup/>
            <PureCup/>
            <PureCup/>
        </>
    );
}
