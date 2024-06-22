import React, {useState} from "react";

export default function Reducer() {
    function clickHandler() {
        //const [i, setIndex] = useState(1);
        /**
         *  React Hook "useState" is called in function "clickHandler"
         *  that is neither a React function component nor
         *  a custom React Hook function.
         *  React component names must start with an uppercase letter.
         *  React Hook names must start with the word "use"
         */
        setIndex(2);
    }

    /**
     * Hooks ——以 use 开头的函数——只能在组件或自定义 Hook 的最顶层调用。
     * 你不能在条件语句、循环语句或其他嵌套函数内调用 Hook。Hook 是函数，
     * 但将它们视为关于组件需求的无条件声明会很有帮助。
     * 在组件顶部 “use” React 特性，类似于在文件顶部“导入”模块。
     */
    const [i, setIndex] = useState(0);
    return (
        <div>
            {i}
            <input onClick={() => clickHandler()} value={"点我试试"}/>
        </div>
    )
}