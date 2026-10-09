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

,parentId:
v.pipe(
 v.string(),
v.nonEmpty(translate("parentId.empty-message")),
v.check((val) => {return /^-?\d+$/.test(val);},translate("parentId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,dictTypeId:
v.pipe(
 v.string(),
v.nonEmpty(translate("dictTypeId.empty-message")),
v.check((val) => {return /^\d+$/.test(val);},translate("dictTypeId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,itemCode:
v.pipe(
 v.string(),
v.nonEmpty(translate("itemCode.empty-message")))

,itemValue:
v.string()
,sort:
v.pipe(
 v.string(),
v.nonEmpty(translate("sort.empty-message")),
v.check((val) => {return /^-?\d+$/.test(val);},translate("sort.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,remark:
v.string()

    });
    //扩展提示
    const FormSchema = InnerFormSchema;
    //type FormData = v.InferOutput<typeof FormSchema>;
    return FormSchema
}
export default createSchema;