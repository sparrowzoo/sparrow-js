
"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import React from "react";
import crateScheme from "@/schema/project-config";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import ProjectConfigApi from "@/api/auto/project-config";
import toast from "react-hot-toast";
import * as v from "valibot";
import {useTranslations} from "next-intl";
import {ValidatableTextarea} from "@/common/components/forms/validatable-textarea";
import {ValidatableInput} from "@/common/components/forms/validatable-input";
import {TableOperationProps,MyTableMeta} from "@/common/lib/table/DataTableProperty";
import {ProjectConfig} from "@/components/project-config/columns";
import useNavigating from "@/common/hook/NavigatingHook";




export default function Page({callbackHandler, table}: TableOperationProps<ProjectConfig>) {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("ProjectConfig.ErrorMessage")
    const pageTranslate = useTranslations("ProjectConfig")
    const validateTranslate = useTranslations("ProjectConfig.validate")

    const FormSchema = crateScheme(validateTranslate);
    type FormData = v.InferOutput<typeof FormSchema>;
    const meta = table.options.meta as MyTableMeta<ProjectConfig>;
    const  Navigations=useNavigating();



    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
        event: React.BaseSyntheticEvent | undefined
    ) => {
        ProjectConfigApi.save(data, errorTranslate,Navigations.redirectToLogin).then(
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
<ValidatableInput readonly={false}  {...register("name")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.name?.message}                                  fieldPropertyName={"name"}/>
<ValidatableInput readonly={false}  {...register("frontendName")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.frontendName?.message}                                  fieldPropertyName={"frontendName"}/>
<ValidatableInput readonly={false}  {...register("chineseName")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.chineseName?.message}                                  fieldPropertyName={"chineseName"}/>
<ValidatableInput readonly={false}  {...register("i18n")}
                                  type={"checkbox"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"i18n"}/>
<ValidatableTextarea className={"w-80 h-60"} readonly={false}  {...register("description")}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"description"}/>
<ValidatableInput readonly={false}  {...register("modulePrefix")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.modulePrefix?.message}                                  fieldPropertyName={"modulePrefix"}/>
<ValidatableInput readonly={false}  {...register("architectures")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"architectures"}/>
<ValidatableTextarea className={"w-80 h-60"} readonly={false}  {...register("config")}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"config"}/>
<ValidatableInput readonly={false}  {...register("wrapWithParent")}
                                  type={"checkbox"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"wrapWithParent"}/>
<ValidatableInput readonly={false}  {...register("scaffold")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                                                    fieldPropertyName={"scaffold"}/>
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