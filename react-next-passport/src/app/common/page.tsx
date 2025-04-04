"use client";
import {
  API_BASIC_URL,
  NEXT_ASSET_PREFIX,
  NODE_ENV,
  TOKEN_KEY,
  TOKEN_STORAGE,
  USER_INFO_KEY,
  WEBSOCKET,
} from "@/common/lib/Env";

import ArrayBufferUtils from "@/common/lib/protocol/ArrayBufferUtils";

export default function Page() {
  return (
    <div>
      <h1>
        Welcome to React Next Passport <br /> websocket: {WEBSOCKET}
        <br />
        asset prefix: {NEXT_ASSET_PREFIX} <br />
        token key: {TOKEN_KEY} <br />
        node env: {NODE_ENV} <br />
        basic api url: {API_BASIC_URL} <br />
        token {TOKEN_STORAGE} <br />
        user info {USER_INFO_KEY}
        <br />
        str2buffer: hello's buffer is {ArrayBufferUtils.str2Buffer("hello")}
        <br />
      </h1>
    </div>
  );
}
