import React, { useImperativeHandle } from "react";

export default function ChildComponent(props: any, ref: any) {
  const [childState, setChildState] = React.useState("Hello from child!");

  // 暴露方法给父组件，以便获取子组件内的状态
  useImperativeHandle(ref, () => ({
    getChildState: () => childState,
  }));
  return (
    <button onClick={() => setChildState("Updated state")}>Update State</button>
  );
}
