"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import React from "react";
import ErrorMessage from "@/common/components/i18n/ErrorMessage";
import crateScheme from "@/schema/project-config";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import ProjectConfigApi from "@/api/auto/project-config";
import toast from "react-hot-toast";
import {RowEditProps} from "@/common/lib/table/DataTableProperty";
import {ValidatableInput} from "@/common/components/forms/ValidatableInput";
import {useTranslations} from "next-intl";
import * as v from "valibot";

export default function EditPage({id,cell}: RowEditProps<any,any>) {
     const globalTranslate = useTranslations("GlobalForm");
        const errorTranslate = useTranslations("ProjectConfig.ErrorMessage")
        const pageTranslate = useTranslations("ProjectConfig")
        const validateTranslate = useTranslations("ProjectConfig.validate")
        const FormSchema = crateScheme(validateTranslate);
        type FormData = v.InferOutput<typeof FormSchema>;
        const original = cell.getContext().row.original;


    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
        event: React.BaseSyntheticEvent | undefined
    ) => {
        ProjectConfigApi.save(data, errorTranslate).then(
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
                <DialogTitle>{globalTranslate("edit")}</DialogTitle>
                <DialogDescription>

                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col">
                <ValidatableInput defaultValue={original.id} {...register("id")}
                                  type={"hidden"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.id?.message}                                  fieldPropertyName={"id"}/>
<ValidatableInput defaultValue={original.name} {...register("name")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.name?.message}                                  fieldPropertyName={"name"}/>
<ValidatableInput defaultValue={original.frontendName} {...register("frontendName")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.frontendName?.message}                                  fieldPropertyName={"frontendName"}/>
<ValidatableInput defaultValue={original.chineseName} {...register("chineseName")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.chineseName?.message}                                  fieldPropertyName={"chineseName"}/>
<ValidatableInput defaultValue={original.i18n} {...register("i18n")}
                                  type={"checkbox"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"i18n"}/>
<ValidatableInput defaultValue={original.description} {...register("description")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.description?.message}                                  fieldPropertyName={"description"}/>
<ValidatableInput defaultValue={original.modulePrefix} {...register("modulePrefix")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.modulePrefix?.message}                                  fieldPropertyName={"modulePrefix"}/>
<ValidatableInput defaultValue={original.scanPackage} {...register("scanPackage")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.scanPackage?.message}                                  fieldPropertyName={"scanPackage"}/>
<ValidatableInput defaultValue={original.architectures} {...register("architectures")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.architectures?.message}                                  fieldPropertyName={"architectures"}/>
<ValidatableInput defaultValue={original.config} {...register("config")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.config?.message}                                  fieldPropertyName={"config"}/>
<ValidatableInput defaultValue={original.wrapWithParent} {...register("wrapWithParent")}
                                  type={"checkbox"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"wrapWithParent"}/>
<ValidatableInput defaultValue={original.scaffold} {...register("scaffold")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.scaffold?.message}                                  fieldPropertyName={"scaffold"}/>
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