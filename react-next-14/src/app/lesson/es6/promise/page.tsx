'use client'
import {useEffect, useState} from "react";
import blog from "@/app/lesson/es6/promise/Blog";

export default function Page() {

    const executor = (resolve: any, reject: any) => {
        try {
            console.log("start of setTimeout");
            setTimeout(() => {
                return resolve({id: 1, title: "This is a page for Promise", completed: true, userId: 1});
            }, 2000);
            console.log("end of setTimeout");
        } catch (error) {
            console.log(error);
            return reject("Error");
        }
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
    return <div><h1>Page</h1>
        {error && <p>{error}</p>}
        <p><br/>
            {data?.title}<br/>
            {data?.userId}<br/>
            {data?.id}<br/>
            {data?.completed}<br/></p></div>;
}
