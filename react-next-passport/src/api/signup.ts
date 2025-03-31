import { FormData } from "@/schema/sign-up";
import Fetcher from "@/common/lib/Fetcher";

export default function signUp(signData: FormData) {
  return Fetcher.post(
    "/register/email/shortcut.json",
    JSON.stringify(signData),
    false,
    true
  );
}
