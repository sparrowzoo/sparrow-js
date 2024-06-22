"use client";
import {sculptureList} from "./data.js";
import React, {useState} from "react";
import MyComponent from "@/app/lesson/state/theoty";
import Image from "next/image";
export default function Gallery() {
    let index = 0;

    function handleClick() {
        index = index + 1;
        alert(index);
    }

    const [i, setIndex] = useState(0);

    function handleClickState() {
        let index = i + 1;
        if (index == sculptureList.length) {
            index = 0;
        }
        setIndex(index);
    }

    let sculpture = sculptureList[index];
    let sculptureState = sculptureList[i];

    function WithoutState() {
        return (
            <>
                <button onClick={handleClick}>我没状态，点了也没反应</button>

                <h2>
                    <i>{sculpture.name} </i>
                    by {sculpture.artist}
                </h2>
                <h3>
                    ({index + 1} of {sculptureList.length})
                </h3>
                <Image src={sculpture.url} alt={sculpture.alt}/>
                <p>{sculpture.description}</p>
            </>
        );
    }

    return (
        <>
            p标签内只能包裹内联元素, 不能包裹块级元素 ， 代码里出现了 p标签 包裹 块元素的现象 。
            https://blog.csdn.net/weixin_44058725/article/details/121692454
            <div>
                <p>当一个组件需要在多次渲染间“记住”某些信息时使用 state 变量。</p>
                <p>State 变量是通过调用 useState Hook 来声明的。</p>
                <p>
                    Hook 是以 use 开头的特殊函数。它们能让你 “hook” 到像 state 这样的
                    React 特性中。
                </p>
                <div>
                    Hook 可能会让你想起 import：
                    <p style={{color: "red"}}> 它们需要在非条件语句中调用</p>。调用 Hook
                    时，包括 useState，仅在组件或另一个 Hook 的顶层被调用才有效。
                </div>
                <p>useState Hook 返回一对值：当前 state 和更新它的函数。</p>
                <div>
                    你可以拥有多个 state 变量。
                    <p style={{color: "red"}}>在内部，React 按顺序匹配它们。</p>
                </div>
                <div>
                    <p style={{color: "red"}}>
                        State
                        是组件私有的。如果你在两个地方渲染它，则每个副本都有独属于自己的
                        state。
                    </p>
                </div>
            </div>
            <WithoutState/>

            <button onClick={handleClickState}>点我，我有状态</button>

            <h2>
                <i>{sculptureState.name} </i>
                by {sculptureState.artist}
            </h2>
            <h3>
                ({i + 1} of {sculptureList.length})
            </h3>
            <Image src={sculptureState.url} alt={sculptureState.alt}/>
            <p>{sculptureState.description}</p>
            <h1>状态的原理</h1>
            <p>https://juejin.cn/post/6891577820821061646</p>
            <MyComponent/>
            <MyComponent/>
        </>
    );
}
