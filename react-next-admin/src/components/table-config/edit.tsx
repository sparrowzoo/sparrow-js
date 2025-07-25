
"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import React from "react";
import crateScheme from "@/schema/table-config";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import TableConfigApi from "@/api/auto/table-config";
import toast from "react-hot-toast";
import {ValidatableInput} from "@/common/components/forms/ValidatableInput";
import {ValidatableTextArea} from "@/common/components/forms/ValidatableTextArea";

import {useTranslations} from "next-intl";
import * as v from "valibot";
import {CellContextProps} from "@/common/lib/table/DataTableProperty";


export default function EditPage({cellContext}: CellContextProps<any>) {
     const globalTranslate = useTranslations("GlobalForm");
        const errorTranslate = useTranslations("TableConfig.ErrorMessage")
        const pageTranslate = useTranslations("TableConfig")
        const validateTranslate = useTranslations("TableConfig.validate")
        const FormSchema = crateScheme(validateTranslate);
        type FormData = v.InferOutput<typeof FormSchema>;
        const original = cellContext.row.original;


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
<ValidatableInput readonly={true} defaultValue={original.projectId} {...register("projectId")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.projectId?.message}                                  fieldPropertyName={"projectId"}/>
<ValidatableInput readonly={true} defaultValue={original.primaryKey} {...register("primaryKey")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.primaryKey?.message}                                  fieldPropertyName={"primaryKey"}/>
<ValidatableInput readonly={true} defaultValue={original.tableName} {...register("tableName")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.tableName?.message}                                  fieldPropertyName={"tableName"}/>
<ValidatableInput readonly={true} defaultValue={original.className} {...register("className")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.className?.message}                                  fieldPropertyName={"className"}/>
<ValidatableInput readonly={false} defaultValue={original.description} {...register("description")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.description?.message}                                  fieldPropertyName={"description"}/>
<ValidatableInput readonly={false} defaultChecked={original.locked} {...register("locked")}
                                  type={"checkbox"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"locked"}/>
<ValidatableInput readonly={false} defaultValue={original.checkable} {...register("checkable")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.checkable?.message}                                  fieldPropertyName={"checkable"}/>
<ValidatableInput readonly={false} defaultValue={original.rowMenu} {...register("rowMenu")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.rowMenu?.message}                                  fieldPropertyName={"rowMenu"}/>
<ValidatableInput readonly={false} defaultValue={original.columnFilter} {...register("columnFilter")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.columnFilter?.message}                                  fieldPropertyName={"columnFilter"}/>
<ValidatableInput readonly={false} defaultChecked={original.statusCommand} {...register("statusCommand")}
                                  type={"checkbox"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"statusCommand"}/>
<ValidatableTextArea className={"w-80 h-60"} readonly={false} defaultValue={original.columnConfigs} {...register("columnConfigs")}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"columnConfigs"}/>
<ValidatableInput readonly={false} defaultValue={original.source} {...register("source")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.source?.message}                                  fieldPropertyName={"source"}/>
<ValidatableTextArea className={"w-80 h-60"} readonly={true} defaultValue={original.sourceCode} {...register("sourceCode")}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"sourceCode"}/>
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