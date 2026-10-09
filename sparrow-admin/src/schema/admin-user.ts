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

,userId:
v.pipe(
 v.string(),
v.nonEmpty(translate("userId.empty-message")),
v.check((val) => {return /^\d+$/.test(val);},translate("userId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,organizationId:
v.pipe(
 v.string(),
v.nonEmpty(translate("organizationId.empty-message")),
v.check((val) => {return /^\d+$/.test(val);},translate("organizationId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,positionId:
v.pipe(
 v.string(),
v.nonEmpty(translate("positionId.empty-message")),
v.check((val) => {return /^\d+$/.test(val);},translate("positionId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))


    });
    //扩展提示
    const FormSchema = InnerFormSchema;
    //type FormData = v.InferOutput<typeof FormSchema>;
    return FormSchema
}
export default createSchema;