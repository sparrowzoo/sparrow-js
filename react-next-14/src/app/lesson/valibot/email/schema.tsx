import * as v from "valibot";

// @ts-ignore
export const InnerFormSchema = v.object({
    email: v.union([v.literal(""),
        v.pipe(
            v.string(),
            v.nonEmpty("邮箱不允许为空"),
            v.minLength(5, "邮箱长度必须在5到30之间"),
            v.maxLength(30, "邮箱长度必须在5到30之间"),
            v.email((issue) => `邮箱格式不正常: Received ${issue.received}`)
        )
    ]),
    email2:
        v.union([v.literal(""), v.pipe(
            v.string(),
            v.minLength(5, "邮箱长度必须在5到30之间"),
            v.maxLength(30, "邮箱长度必须在5到30之间"),
            v.email("请输入正确的邮箱格式"))
        ], (issue) => {
            if (issue.issues) {
                return issue.issues[issue.issues.length - 1].message;
            }
            return "";
        }),
    email3:
        v.pipe(
            v.string(),
            v.nonEmpty("邮箱不能为空"),
            v.minLength(5, "邮箱长度必须在5到30之间"),
            v.maxLength(30, "邮箱长度必须在5到30之间"),
            v.email("请输入正确的邮箱格式"))
});

export const OuterSchema = InnerFormSchema;
type InputForm = v.InferInput<typeof InnerFormSchema>;
//等价于
// type InputForm = {
//     age: string;
// }
// const inputForm: InputForm = {
//     age: 18,
//     userName: "zhangsan"
// };


export type FormData = v.InferOutput<typeof InnerFormSchema>; // { email: string; password: string }

// const formDate: FormData = {
//     age: 18
// }

// Infer output TypeScript type of login schema
//等价于
// type FormData = {
//     age: number;
// }


console.log("看后台输出 pipe method:", v.pipe(v.string()));
console.log("看后台输出 string schema:", v.string());
console.log("看后台输出 digits action:", v.digits());
