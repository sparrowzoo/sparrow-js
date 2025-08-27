import {FormData} from "@/schema/sign-up";
import Fetcher from "@/common/lib/Fetcher";

export default function signUp(signData: FormData, translator: any) {
  return Fetcher.post({
    url: "/register/email/shortcut.json",
    body:signData,
    translator,
    withCookie:true
  });
}
