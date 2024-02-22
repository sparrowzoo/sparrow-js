import React from "react";

/**
 * 你可能已经注意到 <MyButton /> 是以大写字母开头的。你可以据此识别 React 组件。React 组件必须以大写字母开头，而 HTML 标签则必须是小写字母。
 * @constructor
 */
export  default function MyButton(props){
    const add = (name) => {
        alert(name);
    };
    //事件传参数
    return (
        <button value={props.name} onClick={()=>add(props.name)}>{props.name}</button>
    )
}
