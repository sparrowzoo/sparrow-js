"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import React from "react";
import crateScheme from "@/schema/table-config";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import TableConfigApi from "@/api/auto/table-config";
import toast from "react-hot-toast";
import * as v from "valibot";
import {useTranslations} from "next-intl";
import {ValidatableInput} from "@/common/components/forms/ValidatableInput";




export default function Page() {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("TableConfig.ErrorMessage")
    const pageTranslate = useTranslations("TableConfig")
    const validateTranslate = useTranslations("TableConfig.validate")

    const FormSchema = crateScheme(validateTranslate);
    type FormData = v.InferOutput<typeof FormSchema>;


    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
        event: React.BaseSyntheticEvent | undefined
    ) => {
        TableConfigApi.save(data, errorTranslate).then(
            (res) => {
                toast.success(globalTranslate("save")+globalTranslate("operation-success"));
            }
        ).catch(()=>{});
    };

    const {
        register,
        handleSubmit,
        control,
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


    // formState.errors;
    return (
        //正确
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>{globalTranslate("add")}</DialogTitle>
                <DialogDescription>

                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col">
                <ValidatableInput  {...register("id")}
                                  type={"hidden"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.id?.message}                                  fieldPropertyName={"id"}/>
<ValidatableInput  {...register("projectId")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.projectId?.message}                                  fieldPropertyName={"projectId"}/>
<ValidatableInput  {...register("primaryKey")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.primaryKey?.message}                                  fieldPropertyName={"primaryKey"}/>
<ValidatableInput  {...register("tableName")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.tableName?.message}                                  fieldPropertyName={"tableName"}/>
<ValidatableInput  {...register("className")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.className?.message}                                  fieldPropertyName={"className"}/>
<ValidatableInput  {...register("description")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.description?.message}                                  fieldPropertyName={"description"}/>
<ValidatableInput  {...register("locked")}
                                  type={"checkbox"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"locked"}/>
<ValidatableInput  {...register("checkable")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.checkable?.message}                                  fieldPropertyName={"checkable"}/>
<ValidatableInput  {...register("rowMenu")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.rowMenu?.message}                                  fieldPropertyName={"rowMenu"}/>
<ValidatableInput  {...register("columnFilter")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.columnFilter?.message}                                  fieldPropertyName={"columnFilter"}/>
<ValidatableInput  {...register("statusCommand")}
                                  type={"checkbox"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"statusCommand"}/>
<ValidatableInput  {...register("columnConfigs")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.columnConfigs?.message}                                  fieldPropertyName={"columnConfigs"}/>
<ValidatableInput  {...register("source")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.source?.message}                                  fieldPropertyName={"source"}/>
<ValidatableInput  {...register("sourceCode")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.sourceCode?.message}                                  fieldPropertyName={"sourceCode"}/>
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