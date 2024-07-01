# Ref

当你希望组件“记住”某些信息，但又不想让这些信息 触发新的渲染 时，你可以使用 ref 。

## useRef Hook

使用 ref 操作 DOM 对象

### 定义ref 对象

```
import { useRef } from 'react';
function MyComponent() {
  const inputRef = useRef<HTMLInputElement>(null);
```

然后将 ref 对象作为 ref 属性传递给想要`操作`的 DOM 节点的 JSX：
HTML节点可以受控。Function Component 则不允许

```
return <input ref={inputRef} />;
```

## forwardRef

如果React组件需要使用forwardRef
https://react.docschina.org/reference/react/forwardRef
在子组件中做如下定义

```
forwardRef(render) 
使用 forwardRef() 让组件接收 ref 并将其传递给子组件：
import { forwardRef } from 'react';
const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
OR
const ForwardInput = forwardRef((props, ref: any) => {
  return <input {...props} ref={ref} />;
});
ForwardInput.displayName = "自定义Name";
```
