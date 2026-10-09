import * as v from "valibot";
function createSchema(translate:(key:string)=>string) {
    const InnerFormSchema = v.object({
        id:
v.string()
,dictTypeId:
v.pipe(
 v.string(),
v.nonEmpty(translate("dictTypeId.empty-message")),
v.check((val) => {return /^\d+$/.test(val);},translate("dictTypeId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,locale:
v.pipe(
 v.string(),
v.nonEmpty(translate("locale.empty-message")))

,typeName:
v.pipe(
 v.string(),
v.nonEmpty(translate("typeName.empty-message")))


    });
    //扩展提示
    const FormSchema = InnerFormSchema;
    //type FormData = v.InferOutput<typeof FormSchema>;
    return FormSchema
}
export default createSchema;