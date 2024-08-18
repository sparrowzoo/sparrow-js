'use client'
import {useEffect, useState} from "react";

export default function Page() {

    type Student = {
        name: string,
        age: number
    }

    type Type2=Record<string,Student>
    const students:Type2 = {
        "1": {
            name: "John",
            age: 20
        },
        "2": {
            name: "Mary",
            age: 21
        }
    }



    useEffect(() => {

    }, []);
    return (
        <div>
            <h1>Type Case</h1>
        </div>
    )
}