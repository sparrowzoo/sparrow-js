"use client";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { FormData, OuterSchema } from "../schema";
import { Button, TextField } from "@mui/material";
import React from "react";

export default function Page() {
  const onSubmit: SubmitHandler<FormData> = (data) => {
    alert(JSON.stringify(data, null, 2));
  };
  const defaultValues: FormData = {
    username: "",
    password: "",
    password2: "",
    email: "",
  };
  const { handleSubmit, control, formState, setValue } = useForm<FormData>({
    defaultValues,
    //相当于v.parse
    resolver: valibotResolver(
      OuterSchema,
      //https://valibot.dev/guides/parse-data/
      { abortEarly: false }
    ), // Useful to check TypeScript regressions
  });

  const handleChange = (e: any) => {
    setValue("username", e.target.value);
    console.log("username is changed");
  };
  // formState.errors;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/*https://react-hook-form.com/advanced-usage#ControlledmixedwithUncontrolledComponents*/}
        <Controller
          control={control}
          name="username"
          render={({ field: { onBlur }, formState, fieldState }) => (
            <>
              <TextField
                defaultValue={""}
                error={fieldState.invalid}
                helperText={formState.errors.username?.message}
                fullWidth
                onChange={handleChange}
                onBlur={onBlur}
              />
              <p>{fieldState.isTouched ? "touched user name" : ""}</p>
            </>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur }, fieldState }) => (
            <>
              <TextField
                error={fieldState.invalid}
                helperText={formState.errors.email?.message}
                fullWidth
                onChange={onChange}
                onBlur={onBlur}
              />
            </>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur }, formState, fieldState }) => (
            <>
              <TextField
                defaultValue={""}
                error={fieldState.invalid}
                helperText={formState.errors.password?.message}
                fullWidth
                onChange={onChange}
                onBlur={onBlur}
              />
            </>
          )}
        />

        <Controller
          control={control}
          name="password2"
          render={({ field: { onChange, onBlur }, formState, fieldState }) => (
            <>
              <TextField
                defaultValue={""}
                error={fieldState.invalid}
                helperText={formState.errors.password2?.message}
                fullWidth
                onChange={onChange}
                onBlur={onBlur}
              />
            </>
          )}
        />
        {formState.isSubmitted ? "submit" : "not submitted"}
        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}
