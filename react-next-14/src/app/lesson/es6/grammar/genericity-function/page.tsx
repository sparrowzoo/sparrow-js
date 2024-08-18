'use client'
import {useEffect, useState} from "react";

export default function Page() {
    const [message, setMessage] = useState<string>();
    useEffect(() => {
        // Type alias for a function that takes a state and returns a new state
        type SetStateFn<T> = (prevState?: T) => T;
        const setState: SetStateFn<string> = (prevState) => {
            return prevState + " hello"
        };
        setMessage(setState("world"));
    }, []);
    return (
        <div>
            <h1>Type Case</h1>
        </div>
    )
}