import * as v from "valibot";

function createSchema(translate: (key: string) => string) {
    const InnerFormSchema = v.object({
        id:
            v.union([v.literal(""), v.pipe(
                v.string(),
                v.check((val) => {
                    return /^\d+$/.test(val);
                }, translate("id.check-message")),
                v.transform((input): number | string => {
                    return parseInt(input, 10);
                }))
            ], (issue) => {
                if (issue.issues) {
                    return issue.issues[issue.issues.length - 1].message;
                }
                return "";
            })
        , name:
            v.string()
        , frontendName:
            v.string()
        , chineseName:
            v.string()
        , i18n:
            v.boolean()
        , description:
            v.string()
        , modulePrefix:
            v.string()
        , scanPackage:
            v.string()
        , architectures:
            v.string()
        , config:
            v.string()
        , wrapWithParent:
            v.boolean()
        , scaffold:
            v.string()

    });
    //扩展提示
    const FormSchema = InnerFormSchema;
    //type FormData = v.InferOutput<typeof FormSchema>;
    return FormSchema
}

export default createSchema;