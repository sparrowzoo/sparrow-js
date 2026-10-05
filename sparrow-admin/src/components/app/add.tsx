
"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import crateScheme from "@/schema/app";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import AppApi from "@/api/auto/app";
import toast from "react-hot-toast";
import * as v from "valibot";
import {useTranslations} from "next-intl";
import {TableOperationProps,MyTableMeta} from "@/common/lib/table/DataTableProperty";
import {App} from "@/components/app/columns";
import useNavigating from "@/common/hook/NavigatingHook";
import {PagerResult} from "@/common/lib/protocol/Result";
import {ValidatableTextarea} from "@/common/components/forms/validatable-textarea";
import {ValidatableInput} from "@/common/components/forms/validatable-input";
import {ValidatableImage} from "@/common/components/forms/validatable-image";



export default function Page({callbackHandler,table}: TableOperationProps<App>) {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("App.ErrorMessage")
    const pageTranslate = useTranslations("App")
    const validateTranslate = useTranslations("App.validate")

    const FormSchema = crateScheme(validateTranslate);
    type FormData = v.InferOutput<typeof FormSchema>;
    const  Navigations=useNavigating();
    const meta = table.options.meta as MyTableMeta<App>;
    const pageResult=(meta.result.data as PagerResult<App>)



    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
    ) => {
        AppApi.save(data, errorTranslate,Navigations.redirectToLogin).then(
            () => {
                callbackHandler?.();
                toast.success(globalTranslate("save")+globalTranslate("operation-success"));
            }
        ).catch(()=>{});
    };

    const {
        register,
        handleSubmit,
        setValue,
        formState: {
            errors,
            isSubmitted
        },
    } = useForm<FormData>({
        //相当于v.parse
        resolver: valibotResolver(
            FormSchema,
            //https://valibot.dev/guides/parse-data/
            {abortEarly: false, lang: "zh-CN"}
        ),
    });



    return (
                <form className="admin-form admin-form-wide" onSubmit={handleSubmit(onSubmit)}>
                                       <DialogHeader>
                                           <DialogTitle>{globalTranslate("add")}</DialogTitle>
                                           <DialogDescription>
                                           </DialogDescription>
                                       </DialogHeader>
                <div className="admin-form-fields">
                <ValidatableInput defaultValue={""} {...register("id")}
                                  type={"hidden"}
                                  fieldPropertyName={"id"}/>
<ValidatableInput readonly={false} defaultValue={""} {...register("tenantId")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.tenantId?.message}                                  fieldPropertyName={"tenantId"}/>
<ValidatableInput readonly={false} defaultValue={""} {...register("code")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.code?.message}                                  fieldPropertyName={"code"}/>
<ValidatableInput readonly={false} defaultValue={""} {...register("name")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.name?.message}                                  fieldPropertyName={"name"}/>
<ValidatableInput readonly={false} defaultValue={""} {...register("sort")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.sort?.message}                                  fieldPropertyName={"sort"}/>
<ValidatableImage readonly={false} defaultValue={""}
                                  pathType={"app_logo"}
                                  setValue={setValue}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.logo?.message}                                  fieldPropertyName={"logo"}/>

<ValidatableTextarea className={"w-80 h-60"} readonly={false} defaultValue={""} {...register("remark")}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  errorMessage={errors.remark?.message}                                  fieldPropertyName={"remark"}/>
            </div>
                         <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">{globalTranslate("cancel")}</Button>
                                        </DialogClose>
                                        <Button type="submit">{globalTranslate("save")}</Button>
                         </DialogFooter>
                    </form>
                );
            };