import React from "react";
import Son from "./Son";

export default function Father(props) {
    return <h1>I.m Father {props.name}
        <Son/>
    </h1>;
}
