'use client'
import {useEffect, useState} from "react";
import blog from "@/app/lesson/es6/promise/Blog";

export default function Page() {

    const executor = (resolve: any, reject: any) => {
        reject("出错了");
    };


    const [data, setData] = useState<blog>()
    const [error, setError] = useState();
    useEffect(() => {
        console.log("useEffect 启动");
        const mockData = new Promise<blog>(executor);
        mockData.then((blog) => {
            setData(blog);
            console.log("拿到数据了");
        }).catch(setError);
    }, []);
    return <div><h1>Promise reject 方法在调用断会catch</h1>
        {error && <p className="text-red-700">{error}</p>}
        <p><br/>
            {data?.title}<br/>
            {data?.userId}<br/>
            {data?.id}<br/>
            {data?.completed}<br/></p></div>;
}
