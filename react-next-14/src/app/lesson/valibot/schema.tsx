import * as v from "valibot";

export const InnerFormSchema = v.object({
    age: v.pipe(
        v.string(),// 初始字符串输入
        v.transform((input): number | string => {
            //是否为浮点数
            const match = /^-?\d+$/.test(input);
            //是否为整数数字 带符号
            //const match = /^-?\d+\.\d+$/.test(str);
            //是否为整数
            //const match = /^\d+$/.test(input);
//isNumber  包括科学计数
            //const match=/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(str.trim());
            if (match) {
                return parseInt(input);
            }
            return input;
        }),
        v.number("请输入数字"), // 确保转换后为数字类型
        v.minValue(1, '年龄不能小于1岁'),
        v.maxValue(100, '年龄不能超过100岁')
    ),
    email: v.union([v.literal(""), v.pipe(
        v.string(),
        v.regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "请输入正确的邮箱地址"))]),
    // email: v.pipe(
    //     v.optional(v.string()), // 允许空值
    //     v.email("The email address is badly formatted.")
    //     // v.endsWith("@163.com")
    // ),
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
        //@ts-ignore
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

// v.parse(OuterSchema, {
//     email: "jane@example.com",
//     password: "12345678",
//     username: "zh_harry",
//     password2: "12345678",
// });

//let StringSchema = v.union([v.literal(""), v.pipe(v.string(), v.email())]);
// StringSchema = v.literal("") || v.pipe(v.string(), v.email());
//https://valibot.dev/api/union/
//Schema to validate an URL or empty string.
const StringSchema = v.union([v.literal(""), v.pipe(v.string(), v.email())]);


v.parse(StringSchema, ""); // 'hello'
v.parse(StringSchema, "22@163.com"); // 'hello'
v.parse(StringSchema, ""); // 'hello'

console.log(v.empty)
