'use client'
import {useEffect, useState} from "react";

export default function Page() {
    const [message, setMessage] = useState<string>();
    useEffect(() => {
        type UserInfo = {
            id?: number;
            name: string;
            email: string;
            password: string;
        };
        //相当于自动加?
        type PasswordIdInfo = Partial<UserInfo>;
        const userInfo: PasswordIdInfo = {
            id: 111,
            password: "johndoe@example.com"
        };
        setMessage(userInfo.password);
    }, []);
    return (
        <div>
            <h1>Type Case</h1>
        </div>
    )
}