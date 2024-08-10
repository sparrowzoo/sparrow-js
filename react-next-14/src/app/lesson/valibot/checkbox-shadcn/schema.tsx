import * as v from "valibot";

export const OuterSchema = v.object({
  rememberMe: v.pipe(v.boolean(), v.any()),
});

export type FormData = v.InferOutput<typeof OuterSchema>; // { email: string; password: string }
