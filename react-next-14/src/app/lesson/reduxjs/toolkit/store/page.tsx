"use client";
import React from "react";
import {Provider} from "react-redux";
import {store} from "./store";
import {BankView} from "./bank";
import BankAccount from "@/app/lesson/reduxjs/toolkit/store/BankAccount";

export default function Page() {
    return (
        <Provider store={store}>
            <BankAccount/>
            <BankView/>
        </Provider>
    );
}
