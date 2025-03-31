import * as v from "valibot";

export const InnerFormSchema = v.object({
  email: v.pipe(v.string("请输入邮箱地址"), v.email("请输入正确的邮箱地址")),
  userName: v.pipe(
    v.string(),
    v.nonEmpty("请输入用户名"),
    v.minLength(6, "用户名至少6个字符"),
    v.maxLength(20, "用户名最多20个字符"),
    v.regex(/^[a-zA-Z0-9_]{6,20}$/, "用户名只能包含字母、数字、下划线和中文")
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty("请输入密码."),
    v.minLength(8, "密码至少8个字符"),
    v.regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
      "密码格式 至少8个字符，至少1个字母，1个数字和1个特殊字符"
    )
  ),

  passwordConfirm: v.pipe(
    v.string(),
    v.nonEmpty("密码不能为空."),
    v.minLength(8, "密码至少8个字符")
  ),
  captcha: v.pipe(
    v.string(),
    v.nonEmpty("请输入验证码."),
    v.minLength(4, "验证码至少4个字符")
  ),
});
type InputForm = v.InferInput<typeof InnerFormSchema>; // { email: string; password: string }

export const OuterSchema = v.pipe(
  InnerFormSchema,
  /**
   * If you only want to validate specific entries,
   * I recommend using partialCheck instead as check can only be executed if the input is fully typed.
   * 要求所有key都输入的情况下才会检查
   *
   *
   */
  /**
   * Type instantiation is excessively deep and possibly infinite typescript
   * //@ts-ignore 跳过类型检查
   */
  //@ts-ignore
  v.forward(
    v.partialCheck(
      [["password"], ["passwordConfirm"]],
      (input: InputForm) => input.password === input.passwordConfirm,
      "The two passwords do not match."
    ),
    ["passwordConfirm"] //错误信息显示的位置
  )
);
export type FormData = v.InferOutput<typeof OuterSchema>; // { email: string; password: string }
