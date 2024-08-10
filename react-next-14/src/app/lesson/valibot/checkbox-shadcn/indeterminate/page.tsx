'use client'
import React, {useEffect} from "react";

export default function Page() {
    const checkboxRef = React.useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = true;
        }
    }, []);
    return (
        <>
            <h2>https://css-tricks.com/indeterminate-checkboxes/</h2>
            <p>
                You can’t make a checkbox indeterminate through HTML. There is no indeterminate attribute. It is a
                property of checkboxes though, which you can change via JavaScript.
            </p>
            <div>
                复选框：<input ref={checkboxRef} type="checkbox" onChange={(e) => console.log(e.target.indeterminate)} checked={true} id="myCheck"/>
            </div>
        </>
    )
}