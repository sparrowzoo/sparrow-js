import Fetcher from "@/common/lib/Fetcher";
import CrosStorage from "@/common/lib/CrosStorage";
import toast from "react-hot-toast";
import Result from "@/common/lib/protocol/Result";
import { redirectToLogin } from "@/common/lib/Navigating";

export default class PasswordApi {
  public static findPassword(email: string) {
    return Fetcher.post(
      "/password/send-find-password-email.json",
      email,
      CrosStorage.getCrosStorage()
    ).then((result: Result) => {
      toast.success("已发送密码重置邮件，请注意查收");
    });
  }

  public static resetPassword(password: string, token: string) {
    return Fetcher.post(
      "/password/reset-password-by-token.json",
      { password: password, token: token },
      CrosStorage.getCrosStorage()
    ).then((result: Result) => {
      toast.success("密码已重置，请重新登录");
      redirectToLogin(false);
    });
  }
}
