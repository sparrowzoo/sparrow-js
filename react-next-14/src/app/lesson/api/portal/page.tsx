'use client'
import {createPortal} from "react-dom";
import {MutableRefObject, useRef} from "react";

export default function App() {
    const containerRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
    return (
        <>
            <div ref={containerRef}>portal container</div>
            <div id="app">
                {containerRef.current &&
                    createPortal(<h1>Example Element</h1>,document.body)}
                <h1>react createPortal Target container is not a DOM element.
                    这里如果用document.getElementById(app)作为createPortal的第二个参数，会报错，
                    因为这里需要用react 虚拟dom中的ref来获取真实dom节点。</h1>
            </div>
        </>
    );
}