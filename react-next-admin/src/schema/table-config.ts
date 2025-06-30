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
,projectId:
v.pipe(
 v.string(),
v.nonEmpty(translate("projectId.empty-message")),
v.check((val) => {return /^\d+$/.test(val);},translate("projectId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,primaryKey:
v.pipe(
 v.string(),
v.nonEmpty(translate("primaryKey.empty-message")))

,tableName:
v.pipe(
 v.string(),
v.nonEmpty(translate("tableName.empty-message")))

,className:
v.pipe(
 v.string(),
v.nonEmpty(translate("className.empty-message")))

,description:
v.pipe(
 v.string(),
v.nonEmpty(translate("description.empty-message")))

,locked:
v.boolean()
,checkable:
v.pipe(
 v.string(),
v.nonEmpty(translate("checkable.empty-message")),
v.check((val) => {return /^\d+$/.test(val);},translate("checkable.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,rowMenu:
v.pipe(
 v.string(),
v.nonEmpty(translate("rowMenu.empty-message")),
v.check((val) => {return /^\d+$/.test(val);},translate("rowMenu.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,columnFilter:
v.pipe(
 v.string(),
v.nonEmpty(translate("columnFilter.empty-message")),
v.check((val) => {return /^\d+$/.test(val);},translate("columnFilter.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,statusCommand:
v.boolean()
,columnConfigs:
v.pipe(
 v.string(),
v.nonEmpty(translate("columnConfigs.empty-message")))

,source:
v.pipe(
 v.string(),
v.nonEmpty(translate("source.empty-message")))

,sourceCode:
v.pipe(
 v.string(),
v.nonEmpty(translate("sourceCode.empty-message")))


    });
    //扩展提示
    const FormSchema = InnerFormSchema;
    //type FormData = v.InferOutput<typeof FormSchema>;
    return FormSchema
}
export default createSchema;