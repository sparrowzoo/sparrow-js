
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
import {ValidatableTextarea} from "@/common/components/forms/validatable-textarea";
import {ValidatableInput} from "@/common/components/forms/validatable-input";
import {TableOperationProps,MyTableMeta} from "@/common/lib/table/DataTableProperty";
import {TableConfig} from "@/components/table-config/columns";
import useNavigating from "@/common/hook/NavigatingHook";




export default function Page({callbackHandler, table}: TableOperationProps<TableConfig>) {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("TableConfig.ErrorMessage")
    const pageTranslate = useTranslations("TableConfig")
    const validateTranslate = useTranslations("TableConfig.validate")

    const FormSchema = crateScheme(validateTranslate);
    type FormData = v.InferOutput<typeof FormSchema>;
    const meta = table.options.meta as MyTableMeta<TableConfig>;
    const  Navigations=useNavigating();



    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
        event: React.BaseSyntheticEvent | undefined
    ) => {
        TableConfigApi.save(data, errorTranslate,Navigations.redirectToLogin).then(
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
<ValidatableInput readonly={false}  {...register("projectId")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.projectId?.message}                                  fieldPropertyName={"projectId"}/>
<ValidatableInput readonly={false}  {...register("primaryKey")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.primaryKey?.message}                                  fieldPropertyName={"primaryKey"}/>
<ValidatableInput readonly={false}  {...register("tableName")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.tableName?.message}                                  fieldPropertyName={"tableName"}/>
<ValidatableInput readonly={false}  {...register("className")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.className?.message}                                  fieldPropertyName={"className"}/>
<ValidatableInput readonly={false}  {...register("description")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.description?.message}                                  fieldPropertyName={"description"}/>
<ValidatableInput readonly={false}  {...register("locked")}
                                  type={"checkbox"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"locked"}/>
<ValidatableInput readonly={false}  {...register("checkable")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.checkable?.message}                                  fieldPropertyName={"checkable"}/>
<ValidatableInput readonly={false}  {...register("rowMenu")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.rowMenu?.message}                                  fieldPropertyName={"rowMenu"}/>
<ValidatableInput readonly={false}  {...register("columnFilter")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.columnFilter?.message}                                  fieldPropertyName={"columnFilter"}/>
<ValidatableInput readonly={false}  {...register("statusCommand")}
                                  type={"checkbox"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"statusCommand"}/>
<ValidatableTextarea className={"w-80 h-60"} readonly={false}  {...register("columnConfigs")}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"columnConfigs"}/>
<ValidatableInput readonly={false}  {...register("source")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.source?.message}                                  fieldPropertyName={"source"}/>
<ValidatableTextarea className={"w-80 h-60"} readonly={false}  {...register("sourceCode")}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"sourceCode"}/>
<ValidatableInput readonly={false}  {...register("pageSize")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.pageSize?.message}                                  fieldPropertyName={"pageSize"}/>
<ValidatableInput readonly={false}  {...register("onlyAccessSelf")}
                                  type={"checkbox"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"onlyAccessSelf"}/>
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