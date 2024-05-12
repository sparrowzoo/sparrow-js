import { useDispatch } from "react-redux";
import { updateBankAccount, updateBankAmount } from "./slice";

export const BankView = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <button
        style={{ color: "red", fontSize: 80 }}
        onClick={() => dispatch(updateBankAccount("England"))}
      >
        change bank account
      </button>
      <br />
      <span> </span>
      <button
        style={{ color: "red", fontSize: 80 }}
        onClick={() => dispatch(updateBankAmount("2000"))}
      >
        change bank amount
      </button>
    </div>
  );
};
