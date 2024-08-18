'use client'
import {useEffect, useState} from "react";

export default function Page() {
    const [message, setMessage] = useState<string>();
    const function1=()=>{
        return "Hello World"
    }
    type type1 =ReturnType<typeof function1>
    useEffect(() => {

    }, []);
    return (
        <div>
            <h1>Type Case</h1>
        </div>
    )
}