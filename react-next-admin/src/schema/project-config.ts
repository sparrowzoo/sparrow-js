import * as v from "valibot";
function createSchema(translate:(key:string)=>string) {
    const InnerFormSchema = v.object({
        id:
v.number()
,name:
v.string()
,frontendName:
v.string()
,chineseName:
v.string()
,i18n:
v.boolean()
,description:
v.string()
,modulePrefix:
v.string()
,scanPackage:
v.string()
,architectures:
v.string()
,config:
v.string()
,wrapWithParent:
v.boolean()
,scaffold:
v.string()

    });
    //扩展提示
    const FormSchema = InnerFormSchema;
    //type FormData = v.InferOutput<typeof FormSchema>;
    return FormSchema
}
export default createSchema;