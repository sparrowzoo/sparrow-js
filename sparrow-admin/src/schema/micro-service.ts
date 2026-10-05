
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

,name:
v.pipe(
 v.string(),
v.nonEmpty(translate("name.empty-message")))

,sort:
v.pipe(
 v.string(),
v.nonEmpty(translate("sort.empty-message")),
v.check((val) => {return /^-?\d+$/.test(val);},translate("sort.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,logo:
v.pipe(
 v.string(),
v.nonEmpty(translate("logo.empty-message")))

,appId:
v.pipe(
 v.string(),
v.nonEmpty(translate("appId.empty-message")),
v.check((val) => {return /^-?\d+$/.test(val);},translate("appId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,url:
v.pipe(
 v.string(),
v.nonEmpty(translate("url.empty-message")))

,remark:
v.pipe(
 v.string(),
v.nonEmpty(translate("remark.empty-message")))


    });
    //扩展提示
    const FormSchema = InnerFormSchema;
    //type FormData = v.InferOutput<typeof FormSchema>;
    return FormSchema
}
export default createSchema;