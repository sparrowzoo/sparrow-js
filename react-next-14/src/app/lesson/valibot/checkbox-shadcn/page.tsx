"use client";
import {SubmitHandler, useForm} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import {FormData, OuterSchema} from "./schema";
import React from "react";
import RadixCheckBox from "@/app/lesson/valibot/checkbox-shadcn/RadixCheckbox";
import CheckboxIndicator from "@/app/lesson/valibot/checkbox-shadcn/indicator";
import {ErrorMessage} from "@hookform/error-message";

const Page = () => {
    const checkboxRef = React.useRef<HTMLButtonElement>(null);
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
            {abortEarly: true}
        ), // Useful to check TypeScript regressions
    });
    const rememberMe = register("rememberMe", {required: true});
    return (
        <>
            <div onClick={() => {
                alert("div clicked");
            }}>
                <h1>原生复选框</h1>
                <form>
                    {/*<input type="checkbox" {...register("rememberMe", {required: true})} />*/}
                    <RadixCheckBox id="rememberMe" ref={checkboxRef}
                                   className={"w-4 h-4 border-2 border-gray-300 rounded-sm"}
                                   name="rememberMe">
                        <CheckboxIndicator/>
                    </RadixCheckBox>

                    {/*<RadixCheckBox id="rememberMe" ref={checkboxRef} className={"w-4 h-4 border-2 border-gray-300 rounded-sm"}*/}
                    {/*               checked={true}*/}
                    {/*               name="rememberMe">*/}
                    {/*    <CheckboxIndicator showIndicator={true} />*/}
                    {/*</RadixCheckBox>*/}

                    <ErrorMessage errors={errors} name="rememberMe"/>
                    <button onClick={handleSubmit(onSubmit)} type="submit">submit</button>
                </form>
            </div>
        </>
    );
};
export default Page;
