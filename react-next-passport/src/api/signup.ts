import { FormData } from "@/schema/sign-up";
import Fetcher from "@/common/lib/Fetcher";
import CrosStorage from "@/common/lib/CrosStorage";

export default function signUp(signData: FormData) {
  return Fetcher.post(
    "/register/email/shortcut.json",
    signData,
    CrosStorage.getCrosStorage(),
    true
  );
}
