
import * as v from "valibot";
function createSchema(translate:(key:string)=>string) {
    const InnerFormSchema = v.object({
        id:
v.string()
,userName:
v.pipe(
 v.string(),
v.nonEmpty(translate("userName.empty-message")))

,chineseName:
v.pipe(
 v.string(),
v.nonEmpty(translate("chineseName.empty-message")))

,birthday:
v.string()
,email:
v.pipe(
 v.string(),
v.nonEmpty(translate("email.empty-message")),
v.email(translate("email.email-message")))

,mobile:
v.pipe(
 v.string(),
v.nonEmpty(translate("mobile.empty-message")),
v.check((val) => {return /^1\d{10}$/.test(val);},translate("mobile.check-message")))

,tel:
v.pipe(
 v.string(),
v.nonEmpty(translate("tel.empty-message")),
v.check((val) => {return /^(\d{4}-|\d{3}-)?(\d{8}|\d{7})$/.test(val);},translate("tel.check-message")))

,idCard:
v.pipe(
 v.string(),
v.nonEmpty(translate("idCard.empty-message")),
v.check((val) => {return /^(\d{15}|\d{17}[\dXx])$/.test(val);},translate("idCard.check-message")))

,gender:
v.pipe(
 v.string(),
v.nonEmpty(translate("gender.empty-message")),
v.check((val) => {return /^\d+$/.test(val);},translate("gender.check-message")),
v.transform((input): number | string => {return parseInt(input,10);}))

,age:
v.string()
,projectId:
v.string()

    });
    //扩展提示
    const FormSchema = InnerFormSchema;
    //type FormData = v.InferOutput<typeof FormSchema>;
    return FormSchema
}
export default createSchema;