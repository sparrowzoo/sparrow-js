import { FormData } from "@/schema/sign-in";
import Fetcher from "@/common/lib/Fetcher";
import CrosStorage from "@/common/lib/CrosStorage";

export default function signIn(signData: FormData) {
  return Fetcher.post(
    "/shortcut-login.json",
    signData,
    CrosStorage.getCurrentStorage(),
    true
  );
}
