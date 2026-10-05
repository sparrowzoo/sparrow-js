
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

,permissionCode:
v.pipe(
 v.string(),
v.nonEmpty(translate("permissionCode.empty-message")))

,permissionName:
v.pipe(
 v.string(),
v.nonEmpty(translate("permissionName.empty-message")))

,permissionType:
v.pipe(
 v.string(),
v.nonEmpty(translate("permissionType.empty-message")),
v.check((val) => {return /^-?\d+$/.test(val);},translate("permissionType.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,appId:
v.pipe(
 v.string(),
v.nonEmpty(translate("appId.empty-message")),
v.check((val) => {return /^-?\d+$/.test(val);},translate("appId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,microServiceId:
v.pipe(
 v.string(),
v.nonEmpty(translate("microServiceId.empty-message")),
v.check((val) => {return /^-?\d+$/.test(val);},translate("microServiceId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,parentId:
v.pipe(
 v.string(),
v.nonEmpty(translate("parentId.empty-message")),
v.check((val) => {return /^-?\d+$/.test(val);},translate("parentId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,operation:
v.string()
,object:
v.string()
,url:
v.string()
,method:
v.pipe(
 v.string(),
v.nonEmpty(translate("method.empty-message")))

,icon:
v.string()
,target:
v.pipe(
 v.string(),
v.nonEmpty(translate("target.empty-message")))

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