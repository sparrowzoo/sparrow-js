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
import {useTranslations} from "next-intl";
import * as v from "valibot";
import {CellContext} from "@tanstack/table-core";

export default function EditPage({cell}: CellContext<any, any>) {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("TableConfig.ErrorMessage")
    const pageTranslate = useTranslations("TableConfig")
    const validateTranslate = useTranslations("TableConfig.validate")
    const FormSchema = crateScheme(validateTranslate);
    type FormData = v.InferOutput<typeof FormSchema>;
    const original = cell.getContext().row.original;


    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
        event: React.BaseSyntheticEvent | undefined
    ) => {
        TableConfigApi.save(data, errorTranslate).then(
            (res) => {
                toast.success(globalTranslate("save") + globalTranslate("operation-success"));
            }
        ).catch(() => {
        });
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
                                  errorMessage={errors.id?.message} fieldPropertyName={"id"}/>
                <ValidatableInput defaultValue={original.projectId} {...register("projectId")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.projectId?.message} fieldPropertyName={"projectId"}/>
                <ValidatableInput defaultValue={original.primaryKey} {...register("primaryKey")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.primaryKey?.message} fieldPropertyName={"primaryKey"}/>
                <ValidatableInput defaultValue={original.tableName} {...register("tableName")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.tableName?.message} fieldPropertyName={"tableName"}/>
                <ValidatableInput defaultValue={original.className} {...register("className")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.className?.message} fieldPropertyName={"className"}/>
                <ValidatableInput defaultValue={original.description} {...register("description")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.description?.message} fieldPropertyName={"description"}/>
                <ValidatableInput defaultValue={original.locked} {...register("locked")}
                                  type={"checkbox"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  fieldPropertyName={"locked"}/>
                <ValidatableInput defaultValue={original.checkable} {...register("checkable")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.checkable?.message} fieldPropertyName={"checkable"}/>
                <ValidatableInput defaultValue={original.rowMenu} {...register("rowMenu")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.rowMenu?.message} fieldPropertyName={"rowMenu"}/>
                <ValidatableInput defaultValue={original.columnFilter} {...register("columnFilter")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.columnFilter?.message} fieldPropertyName={"columnFilter"}/>
                <ValidatableInput defaultValue={original.statusCommand} {...register("statusCommand")}
                                  type={"checkbox"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  fieldPropertyName={"statusCommand"}/>
                <ValidatableInput defaultValue={original.columnConfigs} {...register("columnConfigs")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.columnConfigs?.message} fieldPropertyName={"columnConfigs"}/>
                <ValidatableInput defaultValue={original.source} {...register("source")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.source?.message} fieldPropertyName={"source"}/>
                <ValidatableInput defaultValue={original.sourceCode} {...register("sourceCode")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.sourceCode?.message} fieldPropertyName={"sourceCode"}/>
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
