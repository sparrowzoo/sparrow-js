import * as v from "valibot";

export const OuterSchema = v.object({
  rememberMe: v.pipe(
    v.any(),
    v.transform((input) => {
      return input === "on";
    })
  ),
});

export type FormData = v.InferOutput<typeof OuterSchema>; // { email: string; password: string }
