"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import React from "react";
import ErrorMessage from "@/common/components/i18n/ErrorMessage";
import {FormData, FormSchema} from "@/schema/menu";
import {Button} from "@/components/ui/button";
import {DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import MenuApi from "@/api/auto/menu";
import toast from "react-hot-toast";
import {useTranslations} from "next-intl";

export default function AddPage() {
    const globalTranslate = useTranslations("GlobalForm");
    const errorTranslate = useTranslations("ProjectConfig.ErrorMessage");

    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
        event: React.BaseSyntheticEvent | undefined
    ) => {
        debugger;
        MenuApi.save(data, errorTranslate).then(
            (res) => {
                toast.success(globalTranslate("operation-success"));
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
                <DialogTitle>${globalTranslate("add")}</DialogTitle>
                <DialogDescription>
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col">
                <div className="flex flex-row justify-start items-center mb-4">
                    <Label className={"justify-end w-[8rem]"} htmlFor="name-1">kw全国各地</Label>
                    <Input className={"w-[16rem]"}  {...register("age")}/>

                    <ErrorMessage messageClass={"text-sm flex-1 text-red-500"} submitted={isSubmitted}
                                  message={errors.age?.message}
                    />
                </div>

            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">${globalTranslate("cancel")}</Button>
                </DialogClose>
                <Button type="submit">${globalTranslate("save")}</Button>
            </DialogFooter>
        </form>
    );
};
