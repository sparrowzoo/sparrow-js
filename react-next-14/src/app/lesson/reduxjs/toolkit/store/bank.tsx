import { useDispatch } from "react-redux";
import { updateBankAccount, updateBankAmount } from "./slice";

export const BankView = () => {
    /**
     * reducer 的两个前提条件:
     * 1. 发布订阅
     * 2. 一定是有共享逻辑封装
     *
     * 一层代理
     * 类似于面向切向编程，将共用逻辑进一步封装
     * 不用reducer 也可以做职责隔离？
     * 封装reducer 函数后，有利于函数的封装，面向切面编程,逻辑复用
     */
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
