'use client'
import {useState} from "react";

export default function Page() {
    const [value, setValue] = useState("我是state 受控");
    return <div>
        <input className={"text-red-700 bg-black"} defaultValue={"非受控"}/>
        <input className={"text-red-700 bg-black"} defaultValue={"受控"}
               value={value} onChange={(e) => setValue(e.target.value)}/>
        <input className={"text-red-700 bg-black"} defaultValue={"受控"}
               value={"没有state"}/>
    </div>;
}
