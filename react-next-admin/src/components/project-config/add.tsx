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
import {ValidatableInput} from "@/common/components/forms/ValidatableInput";


export default function Page() {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("ProjectConfig.ErrorMessage")
    const pageTranslate = useTranslations("ProjectConfig")
    const validateTranslate = useTranslations("ProjectConfig.validate")

    const FormSchema = crateScheme(validateTranslate);
    type FormData = v.InferOutput<typeof FormSchema>;


    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
        event: React.BaseSyntheticEvent | undefined
    ) => {
        ProjectConfigApi.save(data, errorTranslate).then(
            (res) => {
                toast.success(globalTranslate("save") + globalTranslate("operation-success"));
            }
        )
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
                <ValidatableInput {...register("name")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.name?.message}
                                  fieldPropertyName={"name"}/>

                <ValidatableInput {...register("chineseName")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.name?.message}
                                  fieldPropertyName={"chineseName"}/>

                <ValidatableInput {...register("description")}
                                  type={"text"}
                                  isSubmitted={isSubmitted}
                                  pageTranslate={pageTranslate}
                                  validateTranslate={validateTranslate}
                                  errorMessage={errors.name?.message}
                                  fieldPropertyName={"description"}/>


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
