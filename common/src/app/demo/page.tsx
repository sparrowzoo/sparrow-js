"use client";
import {
  API_BASIC_URL,
  NEXT_ASSET_PREFIX,
  NODE_ENV,
  SESSION_STORAGE,
  TOKEN_KEY,
  TOKEN_STORAGE,
  USER_INFO_KEY,
  WEBSOCKET,
} from "@/common/lib/Env";

import ArrayBufferUtils from "@/common/lib/protocol/ArrayBufferUtils";
import { getToken } from "@/common/lib/TokenUtils";
import { useEffect, useState } from "react";

export default function Page() {
  const [token, setToken] = useState("");
  useEffect(() => {
    getToken(() => {
      return Promise.resolve("服务器获取游客token");
    }).then(setToken);
  }, []);
  return (
    <div>
      <h1>
        Welcome to React Next Passport <br /> websocket: {WEBSOCKET}
        <br />
        asset prefix: {NEXT_ASSET_PREFIX} <br />
        session storage: {SESSION_STORAGE} <br />
        token key: {TOKEN_KEY} <br />
        node env: {NODE_ENV} <br />
        basic api url: {API_BASIC_URL} <br />
        token {TOKEN_STORAGE} <br />
        user info {USER_INFO_KEY}
        <br />
        str2buffer: hello's buffer is {ArrayBufferUtils.str2Buffer("hello")}
        get token: {token}
      </h1>
    </div>
  );
}
