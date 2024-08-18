'use client'
import {useEffect, useState} from "react";

export default function Page() {

    function function1(a: number, b: string){
        return a + b;
    }

    type parameters =Parameters<typeof function1>
    type parameters1={
        a: number,
        b: string
    }

    useEffect(() => {

    }, []);
    return (
        <div>
            <h1>Type Case</h1>
        </div>
    )
}