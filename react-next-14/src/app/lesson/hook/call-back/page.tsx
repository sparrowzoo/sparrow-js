'use client'
import React from "react";

type SetStateFn<T> = (prevState?: T) => T;
export default function Page() {
    console.log("CallBack Page")
    //通过 React.Dispatch<React.SetStateAction<number | undefined>>自定义callback 参数类型
    const setValue2: React.Dispatch<string> = React.useCallback(
        (nextValue): string => {
            return nextValue.toString();
        },
        []
    );

    const setValue: React.Dispatch<React.SetStateAction<number | undefined>> = React.useCallback(
        (nextValue) => {
            const setter = nextValue as SetStateFn<number | undefined>;
            const value = typeof nextValue === 'function' ? setter(100) : nextValue;
            return value;
        },
        []
    );
    const value = setValue((prevValue) => {
        return (prevValue ?? 0) + 200;
    });
    console.log(value);
    return (
        <div>
            通过 React.Dispatch React.SetStateAction 自定义callback 参数类型
        </div>
    );
}