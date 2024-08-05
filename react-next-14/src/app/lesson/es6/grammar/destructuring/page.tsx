import React, {useEffect, useState} from "react";

type UseControllableStateParams<T> = {
    prop?: T | undefined;
    defaultProp?: T | undefined;
    onChange?: (state: T) => void;
};
function useControllableState<T>({
                                    defaultProp
                                 }:Omit<UseControllableStateParams<T>, 'prop'|'onChange'>) {
    //如果传入了 prop，则认为是受控组件，否则是非受控组件
    const uncontrolledState = React.useState<T | undefined>(defaultProp);
    const [value] = uncontrolledState;
}

export default function Page() {
    const [message, setMessage] = useState<string>();
    useEffect(() => {
        type UseControllableStateParams<T> = {
            prop?: T | undefined;
            defaultProp?: T | undefined;
            onChange?: (state: T) => void;
        };

    }, []);
    return (
        <div>
            <h1>Type Case</h1>
        </div>
    )
}