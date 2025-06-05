import * as v from "valibot";

// @ts-ignore
export const InnerFormSchema = v.object({
    mobile: v.union([v.literal(""), v.pipe(
        v.string(),
        v.check((val) => {
            return /^1\d{10}$/.test(val);
        }, "请输入正确的手机号格式"))
    ], (issue) => {
        if (issue.issues) {
            return issue.issues[issue.issues.length - 1].message;
        }
        return "";
    }),
    mobile2:
        v.union([v.literal(""), v.pipe(
            v.string(),
            v.check((val) => {
                return /^1\d{10}$/.test(val);
            }, "请输入正确的手机号格式"))
        ], (issue) => {
            if (issue.issues) {
                return issue.issues[issue.issues.length - 1].message;
            }
            return "";
        }),
    mobile3:
        v.pipe(
            v.string(),
            v.nonEmpty("手机号不能为空"),
            v.check((val) => {
                return /^1\d{10}$/.test(val);
            }, "请输入正确的手机号格式"))

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
