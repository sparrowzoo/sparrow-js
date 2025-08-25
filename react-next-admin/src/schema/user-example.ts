
import * as v from "valibot";
function createSchema(translate:(key:string)=>string) {
    const InnerFormSchema = v.object({
        id:
v.union([v.literal(""),v.pipe(
 v.string(),
v.check((val) => {return /^\d+$/.test(val);},translate("id.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))
], (issue) => {        if (issue.issues) {
            return issue.issues[issue.issues.length - 1].message;
        }
        return "";
    })
,userName:
v.pipe(
 v.string(),
v.nonEmpty(translate("userName.empty-message")))

,chineseName:
v.pipe(
 v.string(),
v.nonEmpty(translate("chineseName.empty-message")))

,birthday:
v.pipe(
 v.string(),
v.nonEmpty(translate("birthday.empty-message")))

,email:
v.pipe(
 v.string(),
v.nonEmpty(translate("email.empty-message")))

,mobile:
v.pipe(
 v.string(),
v.nonEmpty(translate("mobile.empty-message")))

,tel:
v.pipe(
 v.string(),
v.nonEmpty(translate("tel.empty-message")))

,idCard:
v.pipe(
 v.string(),
v.nonEmpty(translate("idCard.empty-message")))

,gender:
v.pipe(
 v.string(),
v.nonEmpty(translate("gender.empty-message")))

,age:
v.pipe(
 v.string(),
v.nonEmpty(translate("age.empty-message")))


    });
    //扩展提示
    const FormSchema = InnerFormSchema;
    //type FormData = v.InferOutput<typeof FormSchema>;
    return FormSchema
}
export default createSchema;