
import * as v from "valibot";
function createSchema(translate:(key:string)=>string) {
    const InnerFormSchema = v.object({
        id:
v.string()
,name:
v.pipe(
 v.string(),
v.nonEmpty(translate("name.empty-message")))

,frontendName:
v.pipe(
 v.string(),
v.nonEmpty(translate("frontendName.empty-message")))

,chineseName:
v.pipe(
 v.string(),
v.nonEmpty(translate("chineseName.empty-message")))

,i18n:
v.string()
,description:
v.string()
,modulePrefix:
v.pipe(
 v.string(),
v.nonEmpty(translate("modulePrefix.empty-message")))

,wrapWithParent:
v.string()
,scaffold:
v.string()

    });
    //扩展提示
    const FormSchema = InnerFormSchema;
    //type FormData = v.InferOutput<typeof FormSchema>;
    return FormSchema
}
export default createSchema;