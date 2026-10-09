import * as v from "valibot";
function createSchema(translate:(key:string)=>string) {
    const InnerFormSchema = v.object({
        id:
v.string()
,tenantId:
v.pipe(
 v.string(),
v.nonEmpty(translate("tenantId.empty-message")),
v.check((val) => {return /^\d+$/.test(val);},translate("tenantId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,organizationId:
v.pipe(
 v.string(),
v.nonEmpty(translate("organizationId.empty-message")),
v.check((val) => {return /^\d+$/.test(val);},translate("organizationId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,code:
v.pipe(
 v.string(),
v.nonEmpty(translate("code.empty-message")))

,name:
v.pipe(
 v.string(),
v.nonEmpty(translate("name.empty-message")))

,sort:
v.pipe(
 v.string(),
v.nonEmpty(translate("sort.empty-message")),
v.check((val) => {return /^\d+$/.test(val);},translate("sort.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))


    });
    //扩展提示
    const FormSchema = InnerFormSchema;
    //type FormData = v.InferOutput<typeof FormSchema>;
    return FormSchema
}
export default createSchema;