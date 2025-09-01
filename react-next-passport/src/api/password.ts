import Fetcher from "@/common/lib/Fetcher";

export default class PasswordApi {
  public static findPassword(email: string, translator: any) {
    return Fetcher.post({
      url: "/password/send-find-password-email.json",
      body: email,
      translator: translator,
    });
  }

  public static resetPassword(
    password: string,
    token: string,
    translator: any
  ) {
    return Fetcher.post({
      url: "/password/reset-password-by-token.json",
      body: { password: password, token: token },
      translator: translator,
    });
  }
}
