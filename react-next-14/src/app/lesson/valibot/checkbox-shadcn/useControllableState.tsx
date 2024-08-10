import * as React from 'react';
import {useCallbackRef} from "@/app/lesson/valibot/checkbox-shadcn/useCallbackRef";
// ?：表示可选参数
type UseControllableStateParams<T> = {
  prop?: T | undefined;
  defaultProp?: T | undefined;
  onChange?: (state: T) => void;
};
// 类型别名
// SetStateFn<T> 是一个函数类型，接收一个参数 prevState?: T，返回一个 T 类型的值
type SetStateFn<T> = (prevState?: T) => T;

function useControllableState<T>({
                                   prop,
                                   defaultProp,
                                   onChange = () => {
                                   }
                                 }: UseControllableStateParams<T>) {
  const [uncontrolledProp, setUncontrolledProp] =
    useUncontrolledState({ defaultProp, onChange });
  //如果传入了 prop，则认为是受控组件，否则是非受控组件
  /**
   * <input defaultValue={defaultValue} value={value} onChange={(e) => setValue(e.target.value)} />
   */
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;
  const handleChange = useCallbackRef(onChange);
  const setValue: React.Dispatch<React.SetStateAction<T | undefined>> = React.useCallback(
    (nextValue) => {
      if (isControlled) {
        const setter = nextValue as SetStateFn<T>;
        const value = typeof nextValue === 'function' ? setter(prop) : nextValue;
        if (value !== prop) handleChange(value as T);
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, handleChange]
  );
  return [value, setValue] as const;
}

//Omit<UseControllableStateParams<T>, 'prop'> 将 prop 排除在外，返回一个新的对象
function useUncontrolledState<T>({
                                   defaultProp,
                                   onChange
                                 }: Omit<UseControllableStateParams<T>, 'prop'>) {


  const uncontrolledState = React.useState<T | undefined>(defaultProp);
  const [value] = uncontrolledState;
  const prevValueRef = React.useRef(value);
  //useCallBack
  /**
   * A custom hook that converts a callback to a ref
   * 1. to avoid triggering re-renders when passed as a prop
   * 2. or avoid re-executing effects when passed as a dependency
   * ? 为什么不直接用官方的useCallBack?
   */
    //这里的useCallbackRef是为了防止 onChange 回调函数被多次调用
  const handleChange = useCallbackRef(onChange);

  //通过 React.Dispatch<React.SetStateAction<number | undefined>>自定义callback 参数类型
  // const setValue: React.Dispatch<React.SetStateAction<number | undefined>> = React.useCallback(
  //   (nextValue) => {
  //     return value;
  //   },
  //   []
  // );

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value as T);
      prevValueRef.current = value;
    }
    return () => {
      console.log('unmount');
    };
  }, [value, prevValueRef, handleChange]);
  return uncontrolledState;
}

export { useControllableState };
