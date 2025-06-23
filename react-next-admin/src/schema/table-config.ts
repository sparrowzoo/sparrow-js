import * as v from "valibot";
function createSchema(translate:(key:string)=>string) {
    const InnerFormSchema = v.object({
        
    });
    const FormSchema = InnerFormSchema;
    type FormData = v.InferOutput<typeof FormSchema>;
    return {FormSchema, FormData}
}
export default createSchema;