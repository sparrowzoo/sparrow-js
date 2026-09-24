import { FormData } from "@/schema/sign-in";
import Fetcher from "@/common/lib/Fetcher";
import type {Translator} from "@/common/lib/TranslatorType";

export default function signIn(signData: FormData, translator: Translator) {
  return Fetcher.post<{token: string}>({
    body: signData,
    url: "/shortcut-login.json",
    translator:translator,
    withCookie:true
  });
}
