"use client";
import { useEffect, useRef, useState } from "react";

/**
 * 这段代码在干嘛？
 * 创建一个引用： 我们用 useRef 创建了一个引用对象 ref。这个引用对象在组件的整个生命周期内都不会变，它的 .current 属性会在每次渲染时保存当前的值。
 *
 * 更新引用： 我们用 useEffect Hook 来更新 ref.current。useEffect 是一个副作用钩子，它会在组件渲染后执行。在这个副作用函数里，我们把传进来的 value 赋值给 ref.current。这样，每次组件重新渲染时，ref.current 都会更新为最新的 value。
 *
 * 返回旧值： 最后，我们返回 ref.current 的当前值。因为 useRef 的特性，这个值其实是上一次渲染时的值，所以它就是我们想要的旧值啦。
 */

export default function Page() {
  console.log("渲染开始");

  function usePrevious(value: number) {
    console.log("渲染之前", value);
    const ref = useRef<number>(value);
    console.log("Use Ref 之前", ref.current);
    useEffect(() => {
      ref.current = value;
      console.log("渲染结束之后执行", ref.current);
      return () => {
        console.log("渲染结束", ref.current);
      };
    }, [value]);
    return ref.current;
  }

  //useState 和useRef 在没有执行setState 方法和ref.current=value 之前,拿到的都是旧值
  const [count, setCount] = useState(10000);
  console.log("use state 之后", count);
  const prevCount = usePrevious(count);
  return (
    <div>
      <p>Current Count: {count}</p>
      <p>Previous Count: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
