import * as v from "valibot";

export const OuterSchema = v.object({
        rememberMe: v.pipe(v.any(),
            v.check(value => {
                return value === true || value === false;
                debugger;
            }, "Remember me must be true or false")
        ),
    })
;

export type FormData = v.InferOutput<typeof OuterSchema>; // { email: string; password: string }
