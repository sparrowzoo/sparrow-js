
"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import React from "react";
import crateScheme from "@/schema/user-example";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import UserExampleApi from "@/api/auto/user-example";
import toast from "react-hot-toast";
import * as v from "valibot";
import {useTranslations} from "next-intl";
import {ValidatableInput} from "@/common/components/forms/validatable-input";
import {ValidatableSelect} from "@/common/components/forms/validatable-select";
import {ValidatableDate} from "@/common/components/forms/validatable-date";
import {TableOperationProps,MyTableMeta} from "@/common/lib/table/DataTableProperty";
import {UserExample} from "@/components/user-example/columns";
import useNavigating from "@/common/hook/NavigatingHook";




export default function Page({callbackHandler, table}: TableOperationProps<UserExample>) {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("UserExample.ErrorMessage")
    const pageTranslate = useTranslations("UserExample")
    const validateTranslate = useTranslations("UserExample.validate")

    const FormSchema = crateScheme(validateTranslate);
    type FormData = v.InferOutput<typeof FormSchema>;
    const meta = table.options.meta as MyTableMeta<UserExample>;
    const  Navigations=useNavigating();



    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
        event: React.BaseSyntheticEvent | undefined
    ) => {
        UserExampleApi.save(data, errorTranslate,Navigations.redirectToLogin).then(
            (res) => {
                callbackHandler();
                toast.success(globalTranslate("save")+globalTranslate("operation-success"));
            }
        ).catch(()=>{});
    };

    const {
        register,
        handleSubmit,
        control,
        setValue,
        getValues,
        formState: {
            errors,
            isSubmitted,
            touchedFields
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
            <form className={"h-[calc(100vh-80px)] flex flex-col"} onSubmit={handleSubmit(onSubmit)}>
                                   <DialogHeader>
                                       <DialogTitle>{globalTranslate("add")}</DialogTitle>
                                       <DialogDescription>
                                       </DialogDescription>
                                   </DialogHeader>
            <div className="min-h-0 flex-1 flex-col overflow-y-scroll">
                <ValidatableInput  {...register("id")}
                                  type={"hidden"}
                                  fieldPropertyName={"id"}/>
<ValidatableInput readonly={false}  {...register("userName")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.userName?.message}                                  fieldPropertyName={"userName"}/>
<ValidatableInput readonly={false}  {...register("chineseName")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.chineseName?.message}                                  fieldPropertyName={"chineseName"}/>
<ValidatableDate readonly={false} fieldPropertyName={"birthday"}
                                 setValue={setValue}
                                 pageTranslate={pageTranslate} />
<ValidatableInput readonly={false}  {...register("email")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.email?.message}                                  fieldPropertyName={"email"}/>
<ValidatableInput readonly={false}  {...register("mobile")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.mobile?.message}                                  fieldPropertyName={"mobile"}/>
<ValidatableInput readonly={false}  {...register("tel")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.tel?.message}                                  fieldPropertyName={"tel"}/>
<ValidatableInput readonly={false}  {...register("idCard")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.idCard?.message}                                  fieldPropertyName={"idCard"}/>
<ValidatableSelect dictionary={meta.result.data.dictionary["gender"]} pageTranslate={pageTranslate} setValue={setValue}
fieldPropertyName={"gender"}/>
<ValidatableInput readonly={false}  {...register("age")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.age?.message}                                  fieldPropertyName={"age"}/>
<ValidatableSelect dictionary={meta.result.data.dictionary["projectId"]} pageTranslate={pageTranslate} setValue={setValue}
fieldPropertyName={"projectId"}/>
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