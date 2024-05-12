import { useEffect } from "react";

interface StatePair {
  state: string;
  setter: any;
}

//这里实际定义的时侯会隔离组件对象
//本demo只是演示在当前组件对象已经确定的情况下
//state 的基本原理

let componentHooks: StatePair[] = [];
let currentHookIndex: number = 0;

function createSetter(cursor: number) {
  return function setterWithCursor(newVal: string) {
    console.log(cursor + "--" + newVal);
    console.log(componentHooks);
    componentHooks[cursor].state = newVal;
  };
}

// useState 在 React 中是如何工作的（简化版）
function useState(initialState: string) {
  let pair = componentHooks[currentHookIndex];
  if (pair) {
    console.log("已经存在组件");
    // 这不是第一次渲染
    // 所以 state pair 已经存在
    // 将其返回并为下一次 hook 的调用做准备
    currentHookIndex++;
    return pair;
  }
  console.log("第一次进行渲染");

  // 这是我们第一次进行渲染
  // 所以新建一个 state pair 然后存储它
  pair = { state: initialState, setter: createSetter(currentHookIndex) };
  // 存储这个 pair 用于将来的渲染
  // 并且为下一次 hook 的调用做准备
  componentHooks[currentHookIndex] = pair;
  currentHookIndex++;
  return pair;
}

// Our component code that uses hooks
function RenderFunctionComponent() {
  const fistNamePair = useState("Yardley"); // cursor: 1
  const lastNamePair = useState("Rudi"); // cursor: 0

  useEffect(() => {
    console.log(componentHooks);
  }, [fistNamePair, lastNamePair]);

  return (
    <div>
      <button onClick={() => fistNamePair.setter("Richard")}>Richard</button>
      <button onClick={() => lastNamePair.setter("Fred")}>Fred</button>
    </div>
  );
}

// This is sort of simulating Reacts rendering cycle
export default function MyComponent() {
  currentHookIndex = 0; // resetting the cursor
  return <RenderFunctionComponent />; // render
}
