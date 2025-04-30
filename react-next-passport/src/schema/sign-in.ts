import * as v from "valibot";

export const SignInFormSchema = v.object({
  userName: v.pipe(
    v.string("请输入用户名或邮箱"),
    v.nonEmpty("请输入用户名或邮箱")
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty("请输入密码."),
    v.minLength(8, "密码至少8个字符"),
    v.regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
      "密码格式 至少8个字符，至少1个字母，1个数字和1个特殊字符(字母、数字和特殊字符 $、@、!、%、*、#、?、&)"
    )
  ),
  captcha: v.pipe(
    v.string(),
    v.nonEmpty("请输入验证码."),
    v.minLength(4, "验证码至少4个字符")
  ),
  rememberMe: v.pipe(
    v.any(),
    v.transform((input): boolean => {
      return input === true;
    })
  ),
});

export type FormData = v.InferOutput<typeof SignInFormSchema>; // { email: string; password: string }
