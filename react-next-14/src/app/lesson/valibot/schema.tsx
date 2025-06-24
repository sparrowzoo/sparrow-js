import * as v from "valibot";

// @ts-ignore
export const InnerFormSchema = v.object({
    age:
        v.union([
            v.literal(""),
            v.pipe(
                v.string(),
                v.digits((issue: v.DigitsIssue<string>) => {
                    debugger;
                    return `年龄必须是数字，而 ${issue.received} 非数字`
                })),
            v.pipe(
                v.string(),
                v.transform((age) => {
                    debugger
                    if (/^\d+$/.test(age)) {
                        return parseInt(age);
                    }
                    return age;
                }),
                v.minValue(5, (issue) => {
                    debugger;
                    return `年龄必须大于等于5岁 ${issue.received}`
                }),
                v.maxValue(100, "年龄必须小于等于100岁")
            )
        ], (issue) => {
            if (issue.issues && issue.issues.length) {
                debugger;
                return issue?.issues?.map(i => i.message).join(" 或 ") as string;
            }
            return "";
        }),
    email:
        v.union([v.literal(""),
            v.pipe(
                v.string(),
                v.nonEmpty("用户名不能为空"),
                v.minLength(5, "用户名长度必须在5到30之间"),
                v.maxLength(30, "用户名长度必须在5到30之间"),
                v.email((issue) => `Inva333lid email: Received ${issue.received}`)
            )
        ]),
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
        v.nonEmpty("Please enter your password.")
    )
});
type InputForm = v.InferInput<typeof InnerFormSchema>;
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
    //ts-ignore
    v.forward(
        v.partialCheck(
            [["password"], ["password2"]],
            //注意这里引用的是内部Schema
            (input: InputForm) => input.password === input.password2,
            "The two passwords do not match."
        ),
        ["password2"] //错误信息显示的位置
    )
);
const inputForm: InputForm = {
    age: "25",
    email: "jane@example.com",
    password: "12345678",
    password2: "12345678",
};
export type FormData = v.InferOutput<typeof InnerFormSchema>; // { email: string; password: string }
const formData: FormData = {
    age: 25,
    email: "jane@example.com",
    password: "12345678",
    password2: "12345678",
}

console.log(v.string());
console.log(v.email());

const StringSchema = v.union([v.literal(""), v.pipe(v.string(), v.email())]);
v.parse(StringSchema, ""); // 'hello'
v.parse(StringSchema, "22@163.com"); // 'hello'
v.parse(StringSchema, ""); // 'hello'

console.log(v.empty)
