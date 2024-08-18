'use client'
import {useEffect, useState} from "react";

export default function Page() {

    type T = {
        name: string,
        age: number
    }
    type parameters =keyof T;
    type parameters2 = "name"|"age";
    useEffect(() => {

    }, []);
    return (
        <div>
            <h1>Type Case</h1>
        </div>
    )
}