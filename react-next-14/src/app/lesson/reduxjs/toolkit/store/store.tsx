import { configureStore } from "@reduxjs/toolkit";
import bankReducer from "./slice";

export const store = configureStore({
  reducer: {
    bank: bankReducer,
  },
});

export type BankState = ReturnType<typeof store.getState>;
