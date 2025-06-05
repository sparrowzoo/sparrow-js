import * as v from "valibot";

// @ts-ignore
export const InnerFormSchema = v.object({
    age: v.union([
        v.literal("", ""),
        v.pipe(
            v.string(),
            v.check((val) => {
                debugger;
                return /^\d+$/.test(val);
            }, "必须是数字"),
            ///等价于^\d+$/
            // v.digits((issue: v.DigitsIssue<string>) => {
            //     debugger;
            //     return `必须是数字，而 ${issue.received} 非数字`
            // }),
            v.transform((age) => {
                debugger
                //if (/^\d+$/.test(age)) {
                return parseInt(age);
                //}
                //return age;
            }),
            v.minValue(5, (issue) => {
                return `年龄必须大于等于5岁 ${issue.received}`
            }),
            v.maxValue(100, "年龄必须小于等于100岁")
        )
    ], (issue) => {
        //
        // if (issue.issues && issue.issues.length) {
        //     return issue.issues.map(i => i.message).join("|")
        // }
        // return "";
        if (issue.issues) {
            return issue.issues[issue.issues.length - 1].message;
        }
        return "";
    }),
    age2:
        v.pipe(
            v.string(),
            v.nonEmpty("年龄不允许为空"),
            v.check((val) => {
                return /^\d+$/.test(val);
            }, "请输入正确的年龄"),
            v.transform((input): number | string => {
                return parseInt(input, 10);
            }),
            v.minValue(5, "年龄不能小于5"),
            v.maxValue(30, "年龄不能大于30")),
    age3:
        v.union([v.literal(""), v.pipe(
            v.string(),
            v.check((val) => {
                return /^\d+$/.test(val);
            }, "请输入正确的年龄"),
            v.transform((input): number | string => {
                return parseInt(input, 10);
            }),
            v.minValue(5, "年龄不能小于5"),
            v.maxValue(30, "年龄不能大于30"))
        ], (issue) => {
            if (issue.issues) {
                return issue.issues[issue.issues.length - 1].message;
            }
            return "";
        })
});

export const FormSchema = InnerFormSchema;
export type FormData = v.InferOutput<typeof FormSchema>;
