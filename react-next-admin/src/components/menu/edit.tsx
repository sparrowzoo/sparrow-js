"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import React from "react";
import ErrorMessage from "@/common/components/i18n/ErrorMessage";
import {FormData, FormSchema} from "@/lib/schema/menu/schema";

const Page = () => {
    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
        event: React.BaseSyntheticEvent | undefined
    ) => {
        console.log(data);
        event?.preventDefault();
        console.log(event);
        alert(JSON.stringify(data, null, 2));
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
            <div className={"flex flex-row items-center justify-start"}>
                <label>age:</label>
                <input {...register("age")} />
                {touchedFields.age}
                {/*{isSubmitted && !errors.age && <span role="alert"><Check/></span>}*/}
                <ErrorMessage submitted={isSubmitted}
                              message={errors.age?.message}
                />
            </div>
            <button type="submit">submit</button>
        </form>
    );
};
export default Page;
