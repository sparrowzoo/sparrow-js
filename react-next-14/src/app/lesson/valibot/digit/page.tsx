"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import {FormData, FormSchema} from "./schema";
import React from "react";
import ErrorMessage from "@/app/lesson/valibot/digit/ErrorMessage";
import runDemo from "@/app/lesson/valibot/digit/runDemo";

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
        ), // Useful to check TypeScript regressions
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
            <div className={"flex flex-row items-center justify-start"}>
                <label>age2:</label>
                <input {...register("age2")} />
                {touchedFields.age2}
                {/*{isSubmitted && !errors.age && <span role="alert"><Check/></span>}*/}
                <ErrorMessage submitted={isSubmitted}
                              message={errors.age2?.message}
                />
            </div>
            <div className={"flex flex-row items-center justify-start"}>
                <label>age3:</label>
                <input {...register("age3")} />
                {touchedFields.age3}
                {/*{isSubmitted && !errors.age && <span role="alert"><Check/></span>}*/}
                <ErrorMessage submitted={isSubmitted}
                              message={errors.age3?.message}
                />
            </div>
            <button type="submit">submit</button>

            <button type={"button"} onClick={() => {
                alert(runDemo["~run"]("WORLD"));
            }}>RUN DEMO
            </button>
        </form>
    );
};
export default Page;
