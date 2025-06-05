"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import {valibotResolver} from "@hookform/resolvers/valibot";
import {FormData, OuterSchema} from "./schema";
import React from "react";

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
        formState: {errors},
    } = useForm<FormData>({
        //相当于v.parse
        resolver: valibotResolver(
            OuterSchema,
            //https://valibot.dev/guides/parse-data/
            {abortEarly: true, lang: "zh-CN"}
        ), // Useful to check TypeScript regressions
    });

    const {onChange, onBlur, ref, name} = register("password", {});
    const passwordOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("passwordOnChange");
        onChange(event);
    };

    const passwordOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        console.log("passwordOnBlur");
        onBlur(event);
    };

    async function handleClick() {
        console.log("handleClick");
        //event?.preventDefault();
        console.log(handleSubmit(onSubmit));
        //return handleSubmit(onSubmit);
        return false;
    }

    // formState.errors;
    return (
        //正确
        <form onSubmit={handleSubmit(onSubmit)}>
            {/*不要自定义onSubmit，使用handleSubmit*/}
            {/*<form onSubmit={handleClick}>*/}
            email:<input {...register("email", {required: true})} />
            {errors.email && <span role="alert">{errors.email.message}</span>}
            <br/>
            age:
            <input {...register("age")} />
            {errors.age && <span role="alert">{errors.age.message}</span>}

            <ErrorMessage errors={errors} name="age"/>
            <ErrorMessage
                errors={errors}
                name="age"
                render={({message}) => <p>{message}</p>}
            />
            <br/>
            password:
            <input
                name={name}
                onChange={passwordOnChange}
                ref={ref}
                onBlur={passwordOnBlur}
                type="password"
            />
            {errors.password && <span role="alert">{errors.password.message}</span>}
            <br/>
            <input {...register("password2")} />
            {errors.password2 && <span role="alert">{errors.password2.message}</span>}
            <br/>
            <button type="submit">submit</button>
        </form>
    );
};
export default Page;
