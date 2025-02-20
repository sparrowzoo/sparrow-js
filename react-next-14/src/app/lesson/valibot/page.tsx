"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { FormData, OuterSchema } from "./schema";
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

  debugger;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    //相当于v.parse
    resolver: valibotResolver(
      OuterSchema,
      //https://valibot.dev/guides/parse-data/
      { abortEarly: true }
    ), // Useful to check TypeScript regressions
  });

  const { onChange, onBlur, ref, name } = register("password", {});
  const passwordOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debugger;
    console.log("passwordOnChange");
    onChange(event);
  };

  const passwordOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    debugger;
    console.log("passwordOnBlur");
    onBlur(event);
  };

  async function handleClick(event: React.BaseSyntheticEvent | undefined) {
    debugger;
    console.log("handleClick");
    await handleSubmit(onSubmit);
    event?.preventDefault();
  }

  // formState.errors;
  return (
    <form onSubmit={handleClick}>
      <input {...register("email", { required: true })} />
      {errors.email && <span role="alert">{errors.email.message}</span>}
      <br />
      <input {...register("username")} />
      {errors.username && <span role="alert">{errors.username.message}</span>}
      <ErrorMessage errors={errors} name="username" />
      <ErrorMessage
        errors={errors}
        name="username"
        render={({ message }) => <p>{message}</p>}
      />
      <br />
      password:
      <input
        name={name}
        onChange={passwordOnChange}
        ref={ref}
        onBlur={passwordOnBlur}
        type="password"
      />
      {errors.password && <span role="alert">{errors.password.message}</span>}
      <br />
      <input {...register("password2")} />
      {errors.password2 && <span role="alert">{errors.password2.message}</span>}
      <br />
      <button type="submit">submit</button>
    </form>
  );
};
export default Page;
