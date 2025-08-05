
import * as v from "valibot";
function createSchema(translate:(key:string)=>string) {
    const InnerFormSchema = v.object({
        id:
v.union([v.literal(""),v.pipe(
 v.string(),
v.check((val) => {return /^\d+$/.test(val);},translate("id.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))
], (issue) => {        if (issue.issues) {
            return issue.issues[issue.issues.length - 1].message;
        }
        return "";
    })
,name:
v.pipe(
 v.string(),
v.nonEmpty(translate("name.empty-message")))

,frontendName:
v.pipe(
 v.string(),
v.nonEmpty(translate("frontendName.empty-message")))

,chineseName:
v.pipe(
 v.string(),
v.nonEmpty(translate("chineseName.empty-message")))

,i18n:
v.boolean()
,description:
v.string()
,modulePrefix:
v.pipe(
 v.string(),
v.nonEmpty(translate("modulePrefix.empty-message")))

,wrapWithParent:
v.boolean()

    });
    //扩展提示
    const FormSchema = InnerFormSchema;
    //type FormData = v.InferOutput<typeof FormSchema>;
    return FormSchema
}
export default createSchema;