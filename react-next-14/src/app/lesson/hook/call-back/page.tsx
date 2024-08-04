import React from "react";

export default function Page() {
    //通过 React.Dispatch<React.SetStateAction<number | undefined>>自定义callback 参数类型
    const setValue2: React.Dispatch<string> = React.useCallback(
        (nextValue): string => {
            return nextValue.toString();
        },
        []
    );

    const setValue: React.Dispatch<React.SetStateAction<number | undefined>> = React.useCallback(
        (nextValue) => {

        },
        []
    );

    return (
        <div>
            通过 React.Dispatch React.SetStateAction 自定义callback 参数类型
        </div>
    );
}