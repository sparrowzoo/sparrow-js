const USER_INFO_KEY = "user_info";
const NODE_ENV = process.env.NODE_ENV;
const API_BASIC_URL = process.env.NEXT_PUBLIC_API;

const TOKEN_STORAGE = process.env.NEXT_PUBLIC_TOKEN_STORAGE;

const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY as string;

const NEXT_ASSET_PREFIX = process.env.NEXT_PUBLIC_ASSET_PREFIX;
const STORAGE_PROXY = process.env.NEXT_PUBLIC_STORAGE_PROXY;
const CAPTCHA_URL = process.env.NEXT_PUBLIC_CAPTCHA_URL;

const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL;
const AVATAR_URL = process.env.NEXT_PUBLIC_AVATAR_URL;
const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_URL;

const VISITOR_AVATAR_URL = process.env.NEXT_PUBLIC_VISITOR_AVATAR_URL;

function allowOrigin(origin: string) {
  const NEXT_PUBLIC_ALLOW_ORIGINS = process.env.NEXT_PUBLIC_ALLOW_ORIGINS;
  if (NEXT_PUBLIC_ALLOW_ORIGINS) {
    return NEXT_PUBLIC_ALLOW_ORIGINS.split(",").includes(origin);
  }
  return true;
}

const WEBSOCKET = process.env.NEXT_PUBLIC_WEBSOCKET;
export {
  NODE_ENV,
  allowOrigin,
  STORAGE_PROXY,
  API_BASIC_URL,
  TOKEN_KEY,
  TOKEN_STORAGE,
  USER_INFO_KEY,
  NEXT_ASSET_PREFIX,
  WEBSOCKET,
  CAPTCHA_URL,
  LOGIN_URL,
  AVATAR_URL,
  UPLOAD_URL,
  VISITOR_AVATAR_URL,
};
