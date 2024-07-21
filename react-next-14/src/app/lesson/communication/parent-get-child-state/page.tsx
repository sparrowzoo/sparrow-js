"use client";
import React, {forwardRef, MutableRefObject, useRef, useState} from "react";
import ChildComponent from "@/app/lesson/communication/parent-get-child-state/Child";
// @ts-ignore
import Markdown from "react-markdown";
// @ts-ignore
import md from "./readme.md";

const ChildComponentForward = forwardRef(ChildComponent);

export interface ForwardMethod {
    getChildState: () => string;
}
interface Rect {
    left: number;
    top: number;
    right: number;
    bottom: number;
};
function RefChildComponent() {
    const [targetRect, setTargetRect] = useState<Rect | null>(null);
    const buttonRef: MutableRefObject<HTMLButtonElement | null> = useRef(null);
    return (
        <>
            <button
                //然后将 ref 对象作为 ref 属性传递给想要操作的 DOM 节点的 JSX：
                ref={buttonRef}// ref is used to get the bounding client rect of the button
                onPointerEnter={() => {
                    const rect = buttonRef.current?.getBoundingClientRect();
                    setTargetRect({
                        left: rect ? rect.left : 0,
                        top: rect ? rect.top : 0,
                        right: rect ? rect.right : 0,
                        bottom: rect ? rect.bottom : 0,
                    });
                }}
                onPointerLeave={() => {
                    setTargetRect(null);
                }}
            >这里是按钮</button>
            {targetRect?.top}
            {targetRect?.left}
            {targetRect?.right}
            {targetRect?.bottom}
        </>
    );
}

// 父组件
const ParentComponent = () => {
    const childRef = useRef<ForwardMethod>();// 子组件的ref
    const handleButtonClick = () => {
        if (childRef.current) {// 判断子组件是否挂载
            console.log(childRef.current);// 打印子组件的ref
            console.log(childRef.current.getChildState());// 调用子组件的方法
            // 获取子组件的状态值
        }
    };

    return (
        <div>
            <Markdown>{md}</Markdown>
            //然后将 ref 对象作为 ref 属性传递给想要操作的 DOM 节点的 JSX 元素
            <ChildComponentForward ref={childRef}/><br/>
            <RefChildComponent/>
            <button onClick={handleButtonClick}>Get Child State Debug 后看console</button>
        </div>
    );
};

export default ParentComponent;
