## useImperativeHandle

获取到子组件内的状态要通过 ref，需要使用 React.forwardRef() 来转发 ref
到子组件，并且要在子组件里使用useImperativeHandle配置返回的ref对象的内容。
这样，子组件就可以将 ref 关联到内部的状态，从而使父组件能够获取到该状态。

暴露方法给父组件，以便获取子组件内的状态
https://react.docschina.org/reference/react/useImperativeHandle

```
useImperativeHandle(ref, createHandle, dependencies?) 
在组件顶层通过调用 useImperativeHandle 来自定义 ref 暴露出来的句柄：

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
```

### Function 组件不组指定refs 请使用React.forwardRef定义

        Warning: Function components cannot be given refs. Attempts to access
        this ref will fail. Did you mean to use React.forwardRef()?



