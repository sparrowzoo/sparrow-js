import * as v from "valibot";
function createSchema(translate:(key:string)=>string) {
    const InnerFormSchema = v.object({
        code:
v.pipe(
 v.string(),
v.nonEmpty(translate("code.empty-message")))

,name:
v.pipe(
 v.string(),
v.nonEmpty(translate("name.empty-message")))

,id:
v.string()
,level:
v.pipe(
 v.string(),
v.nonEmpty(translate("level.empty-message")),
v.check((val) => {return /^\d+$/.test(val);},translate("level.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,tenantId:
v.pipe(
 v.string(),
v.nonEmpty(translate("tenantId.empty-message")),
v.check((val) => {return /^\d+$/.test(val);},translate("tenantId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,parentId:
v.pipe(
 v.string(),
v.nonEmpty(translate("parentId.empty-message")),
v.check((val) => {return /^-?\d+$/.test(val);},translate("parentId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,manager:
v.pipe(
 v.string(),
v.nonEmpty(translate("manager.empty-message")))

,telephone:
v.pipe(
 v.string(),
v.nonEmpty(translate("telephone.empty-message")),
v.check((val) => {return /^1\d{10}$/.test(val);},translate("telephone.check-message")))

,sort:
v.pipe(
 v.string(),
v.nonEmpty(translate("sort.empty-message")),
v.check((val) => {return /^-?\d+$/.test(val);},translate("sort.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))


    });
    //扩展提示
    const FormSchema = InnerFormSchema;
    //type FormData = v.InferOutput<typeof FormSchema>;
    return FormSchema
}
export default createSchema;