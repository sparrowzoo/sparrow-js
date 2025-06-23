import * as v from "valibot";
function createSchema(translate:(key:string)=>string) {
    const InnerFormSchema = v.object({
        id:
v.any()
,name:
v.union([v.literal(""),v.pipe(
 v.string(),
 v.minLength(5, translate("name.min-length-message")),
v.maxLength(30, translate("name.max-length-message")))
], (issue) => {        if (issue.issues) {
            return issue.issues[issue.issues.length - 1].message;
        }
        return "";
    })
,frontendName:
v.union([v.literal(""),v.pipe(
 v.string(),
 v.minLength(5, translate("frontendName.min-length-message")),
v.maxLength(30, translate("frontendName.max-length-message")))
], (issue) => {        if (issue.issues) {
            return issue.issues[issue.issues.length - 1].message;
        }
        return "";
    })
,chineseName:
v.union([v.literal(""),v.pipe(
 v.string(),
 v.minLength(5, translate("chineseName.min-length-message")),
v.maxLength(30, translate("chineseName.max-length-message")))
], (issue) => {        if (issue.issues) {
            return issue.issues[issue.issues.length - 1].message;
        }
        return "";
    })
,description:
v.union([v.literal(""),v.pipe(
 v.string(),
 v.minLength(5, translate("description.min-length-message")),
v.maxLength(30, translate("description.max-length-message")))
], (issue) => {        if (issue.issues) {
            return issue.issues[issue.issues.length - 1].message;
        }
        return "";
    })
,modulePrefix:
v.any()
,scanPackage:
v.any()
,architectures:
v.any()
,config:
v.any()
,wrapWithParent:
v.any()
,scaffold:
v.any()
,actions:
v.any()
,filters:
v.any()

    });
    const FormSchema = InnerFormSchema;
    type FormData = v.InferOutput<typeof FormSchema>;
    return {FormSchema, FormData}
}
export default createSchema;