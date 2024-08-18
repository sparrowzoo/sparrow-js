'use client'
import {useEffect} from "react";

export default function Page() {
useEffect(() => {
   console.log("useEffect")
},[]);
    return (
        <div>
            Typescript中?? ?: ?. 都代表什么作用
        </div>
    )
}