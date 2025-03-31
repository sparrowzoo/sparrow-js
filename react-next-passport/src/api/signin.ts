import { FormData } from "@/schema/sign-in";
import Fetcher from "@/common/lib/Fetcher";

export default function signIn(signData: FormData) {
  return Fetcher.post(
    "/shortcut-login.json",
    JSON.stringify(signData),
    false,
    true
  );
}
