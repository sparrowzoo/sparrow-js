'use client'
import {useEffect, useState} from "react";
import blog from "@/app/lesson/es6/promise/Blog";

export default function Page() {
    const fetchData = async (title: string) => {
        console.log("获取远程数据");
        try {
            const mockData = new Promise<blog>((resolve, reject) => {
                try {
                    setTimeout(() => {
                        console.log("数据已拿到");
                        return resolve({id: 1, title: title, completed: true, userId: 1});
                    }, 2000);
                    console.log("异步执行完成");
                } catch (error:any) {
                    console.log(error);
                    return reject(error.message);
                }
            });
            const data = await mockData;
            console.log("这时会waiting 等待数据返回");
            setData(data);
        } catch (error: any) {
            console.log(error.message);
        }
    };

    async function wrapFetchData(title: string) {
        await fetchData(title);
        console.log("这里可以await");
        console.log("这里可以await");
    }
    const [data, setData] = useState<blog>()
    const [error, setError] = useState();
    useEffect(() => {
        console.log("页面初始化");
        wrapFetchData("this is sync promise demo");
        console.log("这里没有办法await");
        return () => {
            console.log("页面卸载");
        };
    }, []);


    return <div><h1>Page</h1>
        {error && <p>{error}</p>}
        <p>
            {data?.title}<br/>
            {data?.userId}<br/>
            {data?.id}<br/>
            {data?.completed}<br/>
        </p>
    </div>;
}
