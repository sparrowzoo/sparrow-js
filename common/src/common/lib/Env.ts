const USER_INFO_KEY = "user_info";
const NODE_ENV = process.env.NODE_ENV;
const API_BASIC_URL = process.env.NEXT_PUBLIC_API;

const TOKEN_STORAGE = process.env.NEXT_PUBLIC_TOKEN_STORAGE;

const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY as string;

const SESSION_STORAGE = "SESSION";

const NEXT_ASSET_PREFIX = process.env.NEXT_PUBLIC_ASSET_PREFIX;
const NEXT_PUBLIC_ALLOW_ORIGINS = process.env.NEXT_PUBLIC_ALLOW_ORIGINS;
const NEXT_PUBLIC_STORAGE_PROXY = process.env.NEXT_PUBLIC_STORAGE_PROXY;

function allowOrigin(origin: string) {
  if (NEXT_PUBLIC_ALLOW_ORIGINS) {
    return NEXT_PUBLIC_ALLOW_ORIGINS.split(",").includes(origin);
  }
  return true;
}

const WEBSOCKET = process.env.NEXT_PUBLIC_WEBSOCKET;
export {
  NODE_ENV,
  allowOrigin,
  NEXT_PUBLIC_STORAGE_PROXY,
  API_BASIC_URL,
  TOKEN_KEY,
  TOKEN_STORAGE,
  SESSION_STORAGE,
  USER_INFO_KEY,
  NEXT_ASSET_PREFIX,
  WEBSOCKET,
};
