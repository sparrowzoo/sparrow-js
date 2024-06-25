'use client'
import {SubmitHandler, useForm, Controller} from 'react-hook-form';
import {valibotResolver} from '@hookform/resolvers/valibot';
import {LoginSchema, FormData} from './schema'
import {TextField} from "@mui/material";
import React from "react";

const Page = () => {
    const onSubmit: SubmitHandler<FormData> = (data) => {
        alert(JSON.stringify(data, null, 2));
    }
    const {
        register,
        handleSubmit,
        control,
        formState:{errors}
    } = useForm<FormData>({
        resolver: valibotResolver(LoginSchema), // Useful to check TypeScript regressions
    });


    // formState.errors;
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('username')} />
            {errors.username && <span role="alert">{errors.username.message}</span>}
            <br/>
            <input {...register('username2')} />
            {errors.username2 && <span role="alert">{errors.username2.message}</span>}
            <br/>
            <input {...register('password')} />
            {errors.password && <span role="alert">{errors.password.message}</span>}
            <br/>

            {/*https://react-hook-form.com/advanced-usage#ControlledmixedwithUncontrolledComponents*/}
            <Controller
                control={control}
                name="username"
                render={({field: {onChange, onBlur}, formState, fieldState}) => (
                    <>
                        <TextField
                            error={fieldState.invalid}
                            helperText={formState.errors.username?.message}
                            fullWidth
                            onChange={onChange}
                            onBlur={onBlur}
                        />
                        <p>{formState.isSubmitted ? "submitted" : ""}</p>
                        <p>{fieldState.isTouched ? "touched" : ""}</p>
                    </>
                )}
            />
            <button type="submit">submit</button>
        </form>
    );
};
export default Page;
