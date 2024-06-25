"use client";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { FormData, FormSchema } from "./schema";
import { TextField } from "@mui/material";
import React from "react";

const Page = () => {
  const onSubmit: SubmitHandler<FormData> = (data) => {
    alert(JSON.stringify(data, null, 2));
  };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    //相当于v.parse
    resolver: valibotResolver(
      FormSchema,
      //https://valibot.dev/guides/parse-data/
      { abortEarly: true }
    ), // Useful to check TypeScript regressions
  });

  // formState.errors;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("username")} />
      {errors.username && <span role="alert">{errors.username.message}</span>}
      <br />
      <input {...register("password")} />
      {errors.password && <span role="alert">{errors.password.message}</span>}
      <br />
      {/*https://react-hook-form.com/advanced-usage#ControlledmixedwithUncontrolledComponents*/}
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur }, formState, fieldState }) => (
          <>
            <TextField
              error={fieldState.invalid}
              helperText={errors.username?.message}
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
