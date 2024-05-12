import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  accountOfBank: string;
  amountOfBank: string;
};

const initialState: InitialState = {
  accountOfBank: "JanPan Bank",
  amountOfBank: "1000",
};

const slice = createSlice({
  name: "bank",
  initialState,
  reducers: {
    updateBankAccount: (state: InitialState, action: PayloadAction<string>) => {
      state.accountOfBank = action.payload;
    },
    updateBankAmount: (state: InitialState, action: PayloadAction<string>) => {
      state.amountOfBank = action.payload;
    },
  },
});
export const { updateBankAccount, updateBankAmount } = slice.actions;
console.log(updateBankAccount("England"));
console.log("bank reducer", slice.caseReducers.updateBankAccount);
console.log("reducer:", slice.reducer);
console.log("action", updateBankAccount);

export default slice.reducer;
