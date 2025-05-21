import Fetcher from "@/common/lib/Fetcher";

export default class PasswordApi {
  public static findPassword(email: string, translator: any) {
    return Fetcher.post(
      "/password/send-find-password-email.json",
      email,
      translator
    );
  }

  public static resetPassword(
    password: string,
    token: string,
    translator: any
  ) {
    return Fetcher.post(
      "/password/reset-password-by-token.json",
      { password: password, token: token },
      translator
    );
  }
}
