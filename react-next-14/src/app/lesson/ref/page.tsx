'use client'
import React, {RefCallback, useEffect} from "react";
import {useComposedRefs} from "@/app/lesson/ref/composeRefs";


export default function Page() {
    const [button, setButton] = React.useState<HTMLButtonElement | null>(null);
    const ref = React.createRef<HTMLButtonElement>();
    const ref2 = React.createRef<HTMLButtonElement>();
    //https://react.docschina.org/reference/react-dom/components/common#ref-callback
    const ref3:RefCallback<HTMLButtonElement>=(node) => setButton(node);
    const composedRefs = useComposedRefs(ref,ref2,ref3);
    useEffect(() => {
        console.log(button);
        console.log(Object.is(ref.current, ref2.current));
        console.log(Object.is(button, ref.current));
        console.log(Object.is(button, ref2.current));
    }, [button]);

    return <>
       <button ref={composedRefs}>看控制台输出 ,点我没用</button>
    </>;
}
