import {useEffect, useState} from "react";

export default function Page() {
    const [message, setMessage] = useState<string>();
    useEffect(() => {
        type Person = {
            name: string;
            age: number;
            address: string;
            phoneNumber: string;
        };
        const userInfo: Person = {
            name: "John",
            age: 30,
            address: "123 Main St",
            phoneNumber: "555-555-5555"
        };
        //重命名
        // 使用重命名时，可以在解构模式中为提取的属性指定新的变量名。
        const {name: userName, age} = userInfo;
        console.log(userName, age);
        setMessage(userInfo.name);
    }, []);
    return (
        <div>
            <h1>解构语法</h1>
        </div>
    )
}