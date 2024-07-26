'use client'
import {useEffect, useLayoutEffect, useState} from "react";

export default function Page() {
    const [count, setCount] = useState(0)
    useLayoutEffect(() => {
        console.log('useEffect')
        let now = performance.now();
        while (performance.now() - now < 1000) {
            // 不做任何事情...
        }
        setCount(1)
    }, [count]);// 只有count变化时才会触发useEffect

    return (
        <div>
            <div>{count}</div>
            <button
                onClick={() => setCount(2)}
            >
                reset {count}
            </button>
        </div>
    )
}


