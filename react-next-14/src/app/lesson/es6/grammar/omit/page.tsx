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

        type UserInfoWithoutPassword = Omit<UserInfo, 'password'|'id'>;
        const userInfo: UserInfoWithoutPassword = {
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