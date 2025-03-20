"use client";
import { useState } from "react";
import { Fetcher } from "@/lib/Fetcher";
import { setToken } from "@/lib/TokenUtils";

export default function Login() {
  const [userName, setUserName] = useState("");

  function handleLogin() {
    console.log("login", userName);
    Fetcher.post(
      "/chat/v2/login",
      JSON.stringify({
        id: userName,
        category: 1,
      }) //必须序列化
    ).then((res: Result) => {
      setToken(res.data);
      console.log(JSON.stringify(res));
    });
  }

  function longHandleLogin() {
    console.log("login", userName);
    Fetcher.post("/chat/v2/long-login", userName).then((res: Result) => {
      setToken(res.data);
      console.log(JSON.stringify(res));
    }); //必须是字符串
    //Fetcher.post("/chat/v2/long-login", parseInt(userName,10));//数字不允许
    //Fetcher.post("/chat/v2/long-login", JSON.stringify(userName));//对象不允许
  }

  return (
    <div>
      <h2>登录</h2>
      <div>
        <input
          className={"text-red-700"}
          onChange={(e) => setUserName(e.target.value)}
          type="text"
          placeholder="用户名"
        />
        <button
          onClick={() => {
            console.log(userName);
            handleLogin();
          }}
        >
          登录
        </button>
        <button
          onClick={() => {
            console.log(userName);
            longHandleLogin();
          }}
        >
          Long UserId登录
        </button>
      </div>
    </div>
  );
}
