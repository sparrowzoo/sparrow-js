"use client";
import { SubmitHandler, useForm } from "react-hook-form";
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
  return (
    <>
      <div>
        <h1>原生复选框 ON</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input value={"on"} type={"checkbox"} {...register("rememberMe")} />
          <button type="submit">submit</button>
        </form>
      </div>
    </>
  );
};
export default Page;
