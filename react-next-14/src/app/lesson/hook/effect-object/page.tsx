'use client'
import {useEffect, useState} from "react";

interface Rect {
    left: number;
    top: number;
    right: number;
    bottom: number;
};

function Demo() {
    const [count, setCount] = useState<Rect>()
    useEffect(() => {
        console.log('useEffect')
        setCount({left: 1, top: 2, right: 3, bottom: 4})
    }, [count]);


    console.log('render')
    return (
        <div>
            <div>{count?.left}</div>
            <button onClick={() => setCount({left: 1, top: 2, right: 3, bottom: 4})}>
                {count?.left}
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


