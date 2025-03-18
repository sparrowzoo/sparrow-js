import {
  NEXT_PUBLIC_TOKEN_PAIRS,
  TOKEN_KEY,
  USER_INFO_KEY,
} from "@/lib/EnvUtils";
import toast from "react-hot-toast";
import { Fetcher } from "@/lib/Fetcher";

function parseTestTokenPairs() {
  const pairsList = NEXT_PUBLIC_TOKEN_PAIRS?.split(",");
  const tokenMap = new Map<string, string>();
  if (pairsList) {
    for (const pair of pairsList) {
      const pairs = pair.split(":");
      tokenMap.set(pairs[0], pairs[1]);
    }
  }
  return tokenMap;
}

export function removeToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_INFO_KEY);
}

export default async function getToken(
  senderId?: string,
  generateVisitorToken?: boolean
) {
  if (generateVisitorToken === undefined || generateVisitorToken === null) {
    generateVisitorToken = false;
  }
  const tokenMap = parseTestTokenPairs();
  if (senderId && tokenMap) {
    if (tokenMap.has(senderId)) {
      return tokenMap.get(senderId) ?? "";
    }
  }

  let token = sessionStorage.getItem(TOKEN_KEY);
  if (token) {
    return token;
  }
  token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    return token;
  }
  if (!generateVisitorToken) {
    return "";
  }
  await Fetcher.get("/chat/v2/get-visitor-token", false)
    .then(async (response: Result) => {
      if (response.code == "0") {
        token = response.data;
        sessionStorage.setItem(TOKEN_KEY, response.data);
      } else {
        toast.error(response.message);
      }
    })
    .catch((error) => {
      toast.error(error.message);
      console.error(error);
    });
  return token;
}
