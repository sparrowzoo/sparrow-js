"use client";
import React, { useCallback } from "react";

type OnChangeType<T> = (state: T) => T | undefined;
type UseControllableStateParams<T> = {
  prop?: T | undefined;
  defaultProp?: T | undefined;
  onChange: OnChangeType<T>;
};

function useCallbackRef<T extends (...args: any[]) => any>(
  callback: T | undefined
): T {
  const callbackRef = React.useRef(callback);
  React.useEffect(() => {
    callbackRef.current = callback;
  });

  // https://github.com/facebook/react/issues/19240
  return React.useMemo(
    () => ((...args) => callbackRef.current?.(...args)) as T,
    []
  );
}

function useUncontrolledState<T>({
  defaultProp,
  onChange,
}: Omit<UseControllableStateParams<T>, "prop">) {
  console.log("defaultProp" + defaultProp);
  const uncontrolledState = React.useState<T | undefined>(defaultProp);
  console.log("uncontrolledState" + uncontrolledState);
  const [value] = uncontrolledState;
  console.log("value" + value);
  const prevValueRef = React.useRef(value);
  console.log("prevValueRef.current" + prevValueRef.current);
  //useCallBack
  /**
   * A custom hook that converts a callback to a ref
   * 1. to avoid triggering re-renders when passed as a prop
   * 2. or avoid re-executing effects when passed as a dependency
   * ? 为什么不直接用官方的useCallBack?
   */
  //const handleChange = useCallbackRef(onChange);
  const handleChange = useCallback<OnChangeType<T>>(onChange, [onChange]);

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value as T);
      prevValueRef.current = value;
    }
    return () => {
      console.log("unmount" + prevValueRef.current);
    };
  }, [value, prevValueRef, handleChange]);
  return uncontrolledState;
}

export default function Page() {
  const onChange = (state: number) => {
    console.log("onChange" + state);
    return state;
  };
  const [uncontrolledCount, setUncontrolledCount] = useUncontrolledState({
    defaultProp: 0,
    onChange: onChange,
  });

  return (
    <div>
      {uncontrolledCount}
      <input
        type="button"
        value="Increment"
        onClick={() => setUncontrolledCount((uncontrolledCount ?? 0) + 1)}
      />
    </div>
  );
}
