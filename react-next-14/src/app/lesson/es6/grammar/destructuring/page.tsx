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
        const person: Person = {
            name: 'John Doe',
            age: 30,
            address: '123 Main St',
            phoneNumber: '555-555-5555'
        };

        type PersonDetails = Pick<Person, 'name' | 'age'>;


        const userInfo: PersonDetails = {
            name: person.name,
            age: person.age
        }

// 相当于：
// type PersonDetails = {
//     name: string;
//     age: number;
// };

        setMessage(userInfo.name);
    }, []);
    return (
        <div>
            <h1>Type Case</h1>
        </div>
    )
}