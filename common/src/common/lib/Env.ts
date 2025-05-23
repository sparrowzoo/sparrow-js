const USER_INFO_KEY = "sparrow_user_info";
const NODE_ENV = process.env.NODE_ENV;
const API_BASIC_URL = process.env.NEXT_PUBLIC_API;

const TOKEN_STORAGE = process.env.NEXT_PUBLIC_TOKEN_STORAGE;

const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY as string;

const NEXT_ASSET_PREFIX = process.env.NEXT_PUBLIC_ASSET_PREFIX;
const STORAGE_PROXY = process.env.NEXT_PUBLIC_STORAGE_PROXY;
const CAPTCHA_URL = process.env.NEXT_PUBLIC_CAPTCHA_URL;

const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL;
const AVATAR_URL = process.env.NEXT_PUBLIC_AVATAR_URL;
const GROUP_AVATAR_URL = process.env.NEXT_PUBLIC_GROUP_AVATAR_URL;
const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_URL;

const VISITOR_AVATAR_URL = process.env.NEXT_PUBLIC_VISITOR_AVATAR_URL;

const WWW_ROOT = process.env.NEXT_PUBLIC_WWW_ROOT;
const PASSPORT_ROOT = process.env.NEXT_PUBLIC_PASSPORT_ROOT;

const SESSION_CATEGORY_GROUP = process.env.NEXT_PUBLIC_SESSION_CATEGORY_GROUP
  ? JSON.parse(process.env.NEXT_PUBLIC_SESSION_CATEGORY_GROUP)
  : "";

const SESSION_CATEGORY_NAME_MAPPING = process.env
  .NEXT_PUBLIC_SESSION_CATEGORY_NAME_MAPPING
  ? JSON.parse(process.env.NEXT_PUBLIC_SESSION_CATEGORY_NAME_MAPPING as string)
  : "";

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
  WWW_ROOT,
  PASSPORT_ROOT,
  allowOrigin,
  STORAGE_PROXY,
  API_BASIC_URL,
  TOKEN_KEY,
  TOKEN_STORAGE,
  USER_INFO_KEY,
  NEXT_ASSET_PREFIX,
  WEBSOCKET,
  SESSION_CATEGORY_GROUP,
  SESSION_CATEGORY_NAME_MAPPING,
  CAPTCHA_URL,
  LOGIN_URL,
  AVATAR_URL,
  GROUP_AVATAR_URL,
  UPLOAD_URL,
  VISITOR_AVATAR_URL,
};
