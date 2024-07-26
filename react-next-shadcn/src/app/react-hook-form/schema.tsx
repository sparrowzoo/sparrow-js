import * as v from "valibot";

export const InnerFormSchema = v.object({


    email: v.pipe(
        v.string("请输入邮箱地址"),
        v.email("请输入正确的邮箱地址")
    ),
    userName: v.pipe(
        v.string("请输入用户名2"),
        v.nonEmpty("请输入用户名"),
        v.minLength(6,"用户名只能包含字母、数字、下划线和中文")
    ),
    password: v.pipe(
        v.string(),
        v.nonEmpty("Please enter your password."),
        v.minLength(8, "Your password must have 8 characters or more.")
    ),

    confirmPassword: v.pipe(
        v.string(),
        v.nonEmpty("Please enter your password."),
        v.minLength(8, "Your password must have 8 characters or more.")
    ),
    captcha: v.pipe(
        v.string(),
        v.nonEmpty("请输入验证码."),
        v.minLength(6, "Your password must have 8 characters or more.")
    ),
});
type InputForm = v.InferInput<typeof InnerFormSchema>; // { email: string; password: string }

export const OuterSchema = v.pipe(
    InnerFormSchema,
    /**
     * If you only want to validate specific entries,
     * I recommend using partialCheck instead as check can only be executed if the input is fully typed.
     * 要求所有key都输入的情况下才会检查
     *
     *
     */
    /**
     * Type instantiation is excessively deep and possibly infinite typescript
     * //@ts-ignore 跳过类型检查
     */
    //@ts-ignore
    v.forward(
        v.partialCheck(
            [["password"], ["confirmPassword"]],
            (input: InputForm) => input.password === input.confirmPassword,
            "The two passwords do not match."
        ),
        ["confirmPassword"] //错误信息显示的位置
    )
);
export type FormData = v.InferOutput<typeof OuterSchema>; // { email: string; password: string }

