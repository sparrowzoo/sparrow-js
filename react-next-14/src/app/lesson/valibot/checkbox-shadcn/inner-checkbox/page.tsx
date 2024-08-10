"use client";
import React from "react";
import CheckBox from "@/app/lesson/valibot/checkbox-shadcn/inner-checkbox/CheckBox";

const Page = () => {

    return (
        <>
            <div onClick={(e) => alert("clicked")}>
                <h1>Shadcn checkbox inner</h1>
                <CheckBox checked={true} control={null} name="checkbox1" bubbles={false}/>
                <CheckBox checked={false} control={null} name="checkbox2" bubbles={false}/>
                <CheckBox checked={"indeterminate"} control={null} name="checkbox3" bubbles={false}/>
                <button type="submit">submit</button>
            </div>
        </>
    );
};
export default Page;
