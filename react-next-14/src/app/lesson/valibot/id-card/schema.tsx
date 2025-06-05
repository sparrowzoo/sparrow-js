import * as v from "valibot";

// @ts-ignore
export const InnerFormSchema = v.object({
    idCard: v.union([v.literal(""), v.pipe(
        v.string(),
        v.check((val) => {
            return /^(\d{15}|\d{17}[\dXx])$/.test(val);
        }, "请输入正确的身份证格式"))
    ], (issue) => {
        if (issue.issues) {
            return issue.issues[issue.issues.length - 1].message;
        }
        return "";
    }),
    idCard2:
        v.union([v.literal(""), v.pipe(
            v.string(),
            v.check((val) => {
                return /^(\d{15}|\d{17}[\dXx])$/.test(val);
            }, "请输入正确的身份证格式"))
        ], (issue) => {
            if (issue.issues) {
                return issue.issues[issue.issues.length - 1].message;
            }
            return "";
        }),
    idCard3:
        v.pipe(
            v.string(),
            v.check((val) => {
                return /^(\d{15}|\d{17}[\dXx])$/.test(val);
            }, "请输入正确的身份证格式"))
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
