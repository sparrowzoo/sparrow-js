'use client'
import {forwardRef, useRef} from 'react';

const ForwardInput = forwardRef((props, ref:any) => {
    return <input {...props} ref={ref} />;
});

function MyInput(props: any) {
    return <input {...props} />;
}

export default function MyForm() {
    const inputRef = useRef(null);

    function handleClick() {
        if (inputRef.current) {
            // @ts-ignore
            inputRef.current.focus();
        }
    }

    return (
        <>
            <p>
                Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean
                to use React.forwardRef()?
            </p>
            <MyInput ref={inputRef}/>

            <ForwardInput ref={inputRef}/>
            <br/>
            {/*<input ref={inputRef}/>*/}
            <button onClick={handleClick}>
                聚焦输入框
            </button>
        </>
    );
}