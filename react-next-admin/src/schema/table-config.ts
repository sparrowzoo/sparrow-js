import * as v from "valibot";

function createSchema(translate: (key: string) => string) {
    const InnerFormSchema = v.object({
        id:
            v.union([v.literal(""), v.pipe(
                v.string(),
                v.check((val) => {
                    return /^\d+$/.test(val);
                }, "请输入正确的数字"),
                v.transform((input): number | string => {
                    return parseInt(input, 10);
                }))
            ], (issue) => {
                if (issue.issues) {
                    return issue.issues[issue.issues.length - 1].message;
                }
                return "";
            })
        , projectId:
            v.pipe(
                v.string(),
                v.nonEmpty("不允许为空"),
                v.check((val) => {
                    return /^\d+$/.test(val);
                }, "请输入正确的数字"),
                v.transform((input): number | string => {
                    return parseInt(input, 10);
                }))

        , primaryKey:
            v.pipe(
                v.string(),
                v.nonEmpty("不允许为空"))

        , tableName:
            v.pipe(
                v.string(),
                v.nonEmpty("不允许为空"))

        , className:
            v.pipe(
                v.string(),
                v.nonEmpty("不允许为空"))

        , description:
            v.pipe(
                v.string(),
                v.nonEmpty("不允许为空"))

        , locked:
            v.boolean()
        , checkable:
            v.pipe(
                v.string(),
                v.nonEmpty("不允许为空"),
                v.check((val) => {
                    return /^\d+$/.test(val);
                }, "请输入正确的数字"),
                v.transform((input): number | string => {
                    return parseInt(input, 10);
                }))

        , rowMenu:
            v.pipe(
                v.string(),
                v.nonEmpty("不允许为空"),
                v.check((val) => {
                    return /^\d+$/.test(val);
                }, "请输入正确的数字"),
                v.transform((input): number | string => {
                    return parseInt(input, 10);
                }))

        , columnFilter:
            v.pipe(
                v.string(),
                v.nonEmpty("不允许为空"),
                v.check((val) => {
                    return /^\d+$/.test(val);
                }, "请输入正确的数字"),
                v.transform((input): number | string => {
                    return parseInt(input, 10);
                }))

        , statusCommand:
            v.boolean()
        , columnConfigs:
            v.string()
        , source:
            v.pipe(
                v.string(),
                v.nonEmpty("不允许为空"),
                v.check((val) => {
                    return /^\d+$/.test(val);
                }, "请输入正确的数字"),
                v.transform((input): number | string => {
                    return parseInt(input, 10);
                }))

        , sourceCode:
            v.string()
        , pageSize:
            v.pipe(
                v.string(),
                v.nonEmpty("不允许为空"),
                v.check((val) => {
                    return /^\d+$/.test(val);
                }, "请输入正确的数字"),
                v.transform((input): number | string => {
                    return parseInt(input, 10);
                }))

        , onlyAccessSelf:
            v.boolean()

    });
    //扩展提示
    const FormSchema = InnerFormSchema;
    //type FormData = v.InferOutput<typeof FormSchema>;
    return FormSchema
}

export default createSchema;
