"use client";
// 父组件
import { createContext, memo, useContext, useMemo, useState } from "react";

const MyContext = createContext(0);

const Parent = () => {
  const [count, setCount] = useState(0);

  // 使用 useMemo 稳定 value 引用
  const contextValue = useMemo(() => count, [count]);

  return (
    <MyContext.Provider value={contextValue}>
      parent: {count}
      <br />
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <Child />
    </MyContext.Provider>
  );
};
Parent.displayName = "Parent";
export default Parent;

// 子组件（优化后）
const Child = memo(() => {
  const count = useContext(MyContext);
  return <div>{count}</div>;
});
Child.displayName = "Child";
