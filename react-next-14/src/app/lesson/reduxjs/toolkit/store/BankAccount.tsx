import React from "react";
import { useSelector } from "react-redux";
import { BankState } from "@/app/lesson/reduxjs/toolkit/store/store";

export default function BankAccount() {
  const { accountOfBank, amountOfBank } = useSelector(
    (state: BankState) => state.bank
  );
  return (
    <>
      <h3>
        accountOfBank - <span style={{ color: "red" }}>{accountOfBank}</span>
      </h3>
      <h3>amountBank - {amountOfBank}</h3>
    </>
  );
}
