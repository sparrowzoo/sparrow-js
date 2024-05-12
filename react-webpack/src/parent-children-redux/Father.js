import React, { useEffect, useState } from "react";
import Son from "./Son";
export default function Father(props) {
    const [name, setName] = useState(props.name);
    const changName = () => {
        setName("lisi" + Math.random());
    };
    // 参考官方文档  https://react.docschina.org/learn/synchronizing-with-effects
    /**
     * 
     * 陷阱
     * 没有依赖数组作为第二个参数，与依赖数组位空数组 [] 的行为是不一致的：

useEffect(() => {
  // 这里的代码会在每次渲染后执行
});

useEffect(() => {
  // 这里的代码只会在组件挂载后执行
}, []);

useEffect(() => {
  //这里的代码只会在每次渲染后，并且 a 或 b 的值与上次渲染不一致时执行
}, [a, b]);
     */

    useEffect(() => {
        console.log("parent init 模拟componentDidMount");
    }, []);

    useEffect(() => {
        console.log("parent state update 模拟componentDidUpdate" + { name }.name);
    }, [name]);//监控状态

    return <div style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
        <h1>
            I.m Father [父组件自身属性]{props.name}<br />
            I.m Father state 【你组件自身状态会改变】{name}
            <Son name={name} />
        </h1>
        <button onClick={changName}>chang name</button>
    </div>;
}
