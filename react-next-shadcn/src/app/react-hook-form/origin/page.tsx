"use client";

import * as React from "react";
export default function Page() {
    const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.target as HTMLFormElement);
        const email = data.get("email");
        console.log(email);
        return false;
    }
    return (
        <div>
            <form onSubmit={handlerSubmit}>
                <input type="email" className="text-red-700" required placeholder="Email" name="email"/>
                <input type="password" className="text-red-700" required placeholder="Password" name="password"/>
                <input type="search" className="text-red-700" required placeholder="Email" name="email"/>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Submit
                </button>
            </form>
        </div>
    );
}
