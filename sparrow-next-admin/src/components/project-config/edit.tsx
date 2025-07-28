overwrite
"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import React from "react";
import crateScheme from "@/schema/project-config";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import ProjectConfigApi from "@/api/auto/project-config";
import toast from "react-hot-toast";
import {ValidatableInput} from "@/common/components/forms/ValidatableInput";
import {ValidatableTextArea} from "@/common/components/forms/ValidatableTextArea";

import {useTranslations} from "next-intl";
import * as v from "valibot";
import {CellContextProps} from "@/common/lib/table/DataTableProperty";


export default function EditPage({cellContext}: CellContextProps<any>) {
     const globalTranslate = useTranslations("GlobalForm");
        const errorTranslate = useTranslations("ProjectConfig.ErrorMessage")
        const pageTranslate = useTranslations("ProjectConfig")
        const validateTranslate = useTranslations("ProjectConfig.validate")
        const FormSchema = crateScheme(validateTranslate);
        type FormData = v.InferOutput<typeof FormSchema>;
        const original = cellContext.row.original;


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


    return (
             <form className={"h-[calc(100vh-80px)] flex flex-col"} onSubmit={handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>{globalTranslate("edit")}</DialogTitle>
                            <DialogDescription>
                            </DialogDescription>
                        </DialogHeader>
            <div className="min-h-0 flex-1 flex-col overflow-y-scroll">
                <ValidatableInput defaultValue={original.id} {...register("id")}
                                  type={"hidden"}
                                  fieldPropertyName={"id"}/>
<ValidatableInput readonly={false} defaultValue={original.name} {...register("name")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.name?.message}                                  fieldPropertyName={"name"}/>
<ValidatableInput readonly={false} defaultValue={original.frontendName} {...register("frontendName")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.frontendName?.message}                                  fieldPropertyName={"frontendName"}/>
<ValidatableInput readonly={false} defaultValue={original.chineseName} {...register("chineseName")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.chineseName?.message}                                  fieldPropertyName={"chineseName"}/>
<ValidatableInput readonly={false} defaultChecked={original.i18n} {...register("i18n")}
                                  type={"checkbox"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"i18n"}/>
<ValidatableTextArea className={"w-80 h-60"} readonly={false} defaultValue={original.description} {...register("description")}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"description"}/>
<ValidatableInput readonly={false} defaultValue={original.modulePrefix} {...register("modulePrefix")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.modulePrefix?.message}                                  fieldPropertyName={"modulePrefix"}/>
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