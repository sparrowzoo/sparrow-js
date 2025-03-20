const USER_INFO_KEY = "user_info";
const NODE_ENV = process.env.NODE_ENV;
const API_BASIC_URL = process.env.NEXT_PUBLIC_API;

const TOKEN_STORAGE = process.env.NEXT_PUBLIC_TOKEN_STORAGE;

const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY as string;

const SESSION_STORAGE = "SESSION";

console.log("API_BASIC_URL", API_BASIC_URL);
console.log("TOKEN_KEY", TOKEN_KEY);
console.log("TOKEN_STORAGE", TOKEN_STORAGE);
console.log("SESSION_STORAGE", SESSION_STORAGE);
export {
  NODE_ENV,
  API_BASIC_URL,
  TOKEN_KEY,
  TOKEN_STORAGE,
  SESSION_STORAGE,
  USER_INFO_KEY,
};
