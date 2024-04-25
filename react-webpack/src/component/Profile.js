import React from "react";

function Profile() {
    return (
        <div>张三</div>
    );
}

export default function gallery() {
    return (
        <section>
            <h1>了不起的科学家</h1>
            <Profile />
            <Profile />
            <Profile />
        </section>
    );
}