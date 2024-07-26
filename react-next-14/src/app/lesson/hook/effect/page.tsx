'use client'
import {useEffect, useState} from "react";

function Demo() {
    const [count, setCount] = useState(0)


    useEffect(() => {
        console.log('useEffect')
        let now = performance.now();
        while (performance.now() - now < 1000) {
            // 不做任何事情...
        }
        setCount(1)
    }, [count]);// 只有count变化时才会触发useEffect



    console.log('render')
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

export default function Page() {

    return (
        <div>

            <Demo/>
        </div>
    )
}


