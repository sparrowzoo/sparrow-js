"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import {FormData, OuterSchema} from "./schema";
import React from "react";
import ErrorMessage from "@/app/lesson/valibot/digit/ErrorMessage";

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
            OuterSchema,
            //https://valibot.dev/guides/parse-data/
            {abortEarly: false, lang: "zh-CN"}
        ), // Useful to check TypeScript regressions
    });


    // formState.errors;
    return (
        //正确
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={"flex flex-row items-center justify-start"}>
                <label>身份证:</label>
                <input {...register("idCard")} />
                {touchedFields.idCard}
                {/*{isSubmitted && !errors.age && <span role="alert"><Check/></span>}*/}
                <ErrorMessage submitted={isSubmitted}
                              message={errors.idCard?.message}
                />
            </div>
            <div className={"flex flex-row items-center justify-start"}>
                <label>身份证2:</label>
                <input {...register("idCard2")} />
                {touchedFields.idCard2}
                {/*{isSubmitted && !errors.age && <span role="alert"><Check/></span>}*/}
                <ErrorMessage submitted={isSubmitted}
                              message={errors.idCard2?.message}
                />
            </div>
            <div className={"flex flex-row items-center justify-start"}>
                <label>身份证3:</label>
                <input {...register("idCard3")} />
                {touchedFields.idCard3}
                {/*{isSubmitted && !errors.age && <span role="alert"><Check/></span>}*/}
                <ErrorMessage submitted={isSubmitted}
                              message={errors.idCard3?.message}
                />
            </div>
            <button type="submit">submit</button>
        </form>
    );
};
export default Page;
