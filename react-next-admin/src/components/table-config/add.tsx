"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import React from "react";
import crateScheme from "@/schema/project-config";
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