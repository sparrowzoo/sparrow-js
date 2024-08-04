import * as v from "valibot";

export const InnerFormSchema = v.object({
  username: v.pipe(v.string("请输入用户名"), v.nonEmpty("Please enter your name.")),
  email: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your email."),
    v.email("The email address is badly formatted.")
    // v.endsWith("@163.com")
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your password."),
    v.minLength(8, "Your password must have 8 characters or more.")
  ),
  password2: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your password."),
    v.minLength(8, "Your password must have 8 characters or more.")
  ),
});

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
      [["password"], ["password2"]],
      //注意这里引用的是输入类型，而不是输出类型
      (input: InputForm) => input.password === input.password2,
      "The two passwords do not match."
    ),
    ["password2"] //错误信息显示的位置
  )
);
type InputForm = v.InferInput<typeof InnerFormSchema>;
// {
// email: string;
// password: string
//}
export type FormData = v.InferOutput<typeof OuterSchema>; // { email: string; password: string }

// Infer output TypeScript type of login schema
//等价于
// export type FormData = {
//     username: string;
//     password: string;
//     // password2: string;
//     email: string;
// };

// Throws error for `email` and `password`
//  v.parse(FormSchema, {
//   username: "zh_harry",
//   email: "zh_harry@163.com",
//   password: "11111111",
// });

v.parse(OuterSchema, {
  email: "jane@example.com",
  password: "12345678",
  username: "zh_harry",
  password2: "12345678",
});

const StringSchema = v.fallback(v.string(), "hello");
const stringOutput = v.parse(StringSchema, 123); // 'hello'
console.log(stringOutput);
