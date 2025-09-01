import { FormData } from "@/schema/sign-in";
import Fetcher from "@/common/lib/Fetcher";

export default function signIn(signData: FormData, translator: any) {
  return Fetcher.post({
    body: signData,
    url: "/shortcut-login.json",
    translator:translator,
    withCookie:true
  });
}
