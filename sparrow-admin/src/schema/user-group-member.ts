import * as v from "valibot";
function createSchema(translate:(key:string)=>string) {
    const InnerFormSchema = v.object({
        id:
v.string()
,tenantId:
v.pipe(
 v.string(),
v.nonEmpty(translate("tenantId.empty-message")),
v.check((val) => {return /^-?\d+$/.test(val);},translate("tenantId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,groupId:
v.pipe(
 v.string(),
v.nonEmpty(translate("groupId.empty-message")),
v.check((val) => {return /^-?\d+$/.test(val);},translate("groupId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,memberType:
v.pipe(
 v.string(),
v.nonEmpty(translate("memberType.empty-message")),
v.check((val) => {return /^-?\d+$/.test(val);},translate("memberType.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,memberId:
v.pipe(
 v.string(),
v.nonEmpty(translate("memberId.empty-message")),
v.check((val) => {return /^-?\d+$/.test(val);},translate("memberId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))


    });
    //扩展提示
    const FormSchema = InnerFormSchema;
    //type FormData = v.InferOutput<typeof FormSchema>;
    return FormSchema
}
export default createSchema;