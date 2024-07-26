'use client'
import {useEffect, useRef, useState} from "react";

export default function Page() {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [buttonPosition, setButtonPosition] = useState<Rect>()

    // useLayoutEffect(() => {
    //     console.log("useLayoutEffect")
    //     // let now = performance.now();
    //     // while (performance.now() - now < 100) {
    //     //     // 不做任何事情...
    //     // }
    //     if (!Object.is({left: 0, top: 0}, buttonPosition)) {
    //         setButtonPosition({left: 0, top: 0});
    //     }
    // }, [buttonPosition])

    useEffect(() => {
        console.log("use effect");
        console.log("same object " + Object.is({left: 0, top: 0}, buttonPosition));
        let now = performance.now();
        while (performance.now() - now < 100) {
            // 不做任何事情...
        }
        setButtonPosition({left: 0, top: 0})
    }, [buttonPosition?.left, buttonPosition?.top])//不能直接引对象，引象引用会变
    //https://react.docschina.org/learn/removing-effect-dependencies
    return (
        <div>
            <button ref={buttonRef} onClick={() => {
                setButtonPosition({left: 100, top: 200});
            }}>Click me
            </button>
            <div style={{position: 'absolute', top: buttonPosition?.top, left: buttonPosition?.left}}>position</div>
        </div>
    )
}

interface Rect {
    left: number;
    top: number;
};


