import * as v from "valibot";
function createSchema(translate:(key:string)=>string) {
    const InnerFormSchema = v.object({
        id:
v.string()
,dictItemId:
v.pipe(
 v.string(),
v.nonEmpty(translate("dictItemId.empty-message")),
v.check((val) => {return /^\d+$/.test(val);},translate("dictItemId.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,locale:
v.pipe(
 v.string(),
v.nonEmpty(translate("locale.empty-message")))

,itemLabel:
v.pipe(
 v.string(),
v.nonEmpty(translate("itemLabel.empty-message")))


    });
    //扩展提示
    const FormSchema = InnerFormSchema;
    //type FormData = v.InferOutput<typeof FormSchema>;
    return FormSchema
}
export default createSchema;