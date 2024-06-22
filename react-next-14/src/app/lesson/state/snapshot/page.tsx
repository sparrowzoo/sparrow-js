"use client";
import React, {useState} from "react";
import Counter from "@/app/lesson/state/snapshot/Counter";
import LaterCounter from "@/app/lesson/state/snapshot/LaterCounter";
import AliceBob from "@/app/lesson/state/snapshot/AliceBob";

function sendMessage(message: string) {
    console.log("from user:" + message);
    // ...
}

export default function Form() {
    const [isSent, setIsSent] = useState(false);
    const [message, setMessage] = useState("HI");


    if (isSent) {
        return (<div>
            <h1>your message is on its way! {message}</h1>
        </div>);
    }

    return (
        <> <Counter/>
            <LaterCounter/>
            <AliceBob/>
            <br/>
            <br/>
            <form onSubmit={(e) => {
                //e.preventDefault();
                console.log("submit")
                setIsSent(true);
                sendMessage(message);
            }}>
      <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
      />
                <button type="submit">Send</button>
            </form>
        </>
    );
}