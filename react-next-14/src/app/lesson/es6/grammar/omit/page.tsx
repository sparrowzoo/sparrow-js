import {useEffect, useState} from "react";

export default function Page() {
    const [message, setMessage] = useState<string>();
    useEffect(() => {
        type UserInfo = {
            id: number;
            name: string;
            email: string;
            password: string;
        };

        type UserInfoWithoutPassword = Omit<UserInfo, 'password'>;
        const userInfo: UserInfoWithoutPassword = {
            id: 1,
            name: "John Doe",
            email: "johndoe@example.com"
        };
        setMessage(userInfo.name);
    }, []);
    return (
        <div>
            <h1>Type Case</h1>
        </div>
    )
}