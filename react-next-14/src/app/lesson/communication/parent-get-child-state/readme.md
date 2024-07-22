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



# useRef 解析
typescript 如果传泛型必须指定null
const childRef = useRef<LocationChildRef>(null);
否则编译不过
https://stackoverflow.com/questions/74989176/type-mutablerefobjectundefined-is-not-assignable-to-type-legacyrefhtmldive

```agsl
    /**
     * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
     * (`initialValue`). The returned object will persist for the full lifetime of the component.
     *
     * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
     * value around similar to how you’d use instance fields in classes.
     *
     * @version 16.8.0
     * @see {@link https://react.dev/reference/react/useRef}
     */
    function useRef<T>(initialValue: T): MutableRefObject<T>;
    // convenience overload for refs given as a ref prop as they typically start with a null value
    /**
     * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
     * (`initialValue`). The returned object will persist for the full lifetime of the component.
     *
     * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
     * value around similar to how you’d use instance fields in classes.
     *
     * Usage note: if you need the result of useRef to be directly mutable, include `| null` in the type
     * of the generic argument.
     *
     * @version 16.8.0
     * @see {@link https://react.dev/reference/react/useRef}
     */
    function useRef<T>(initialValue: T | null): RefObject<T>;
    // convenience overload for potentially undefined initialValue / call with 0 arguments
    // has a default to stop it from defaulting to {} instead
    /**
     * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
     * (`initialValue`). The returned object will persist for the full lifetime of the component.
     *
     * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
     * value around similar to how you’d use instance fields in classes.
     *
     * @version 16.8.0
     * @see {@link https://react.dev/reference/react/useRef}
     */
    function useRef<T = undefined>(): MutableRefObject<T | undefined>;
```



