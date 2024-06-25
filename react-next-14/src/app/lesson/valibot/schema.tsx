import * as v from "valibot";

export const InnerFormSchema = v.object({
    username: v.pipe(
        v.string(),
        v.nonEmpty("Please enter your email."),
    ),
    email: v.pipe(
        v.string(),
        v.nonEmpty("Please enter your email."),
        v.email("The email address is badly formatted."),
        // v.endsWith("@163.com")
    ),
    password: v.pipe(
        v.string(),
        v.nonEmpty("Please enter your password."),
        v.minLength(8, "Your password must have 8 characters or more."),
    ),
    password2: v.pipe(
        v.string(),
        v.nonEmpty("Please enter your password."),
        v.minLength(8, "Your password must have 8 characters or more.")),
});

export const OuterSchema = v.pipe(
    InnerFormSchema,
    v.forward(
        v.check(({password, password2}) => password == password2, 'The password2 is incorrect.'),
        ['password2']
    )
);


// Infer output TypeScript type of login schema
export type FormData = v.InferOutput<typeof OuterSchema>; // { email: string; password: string }
//等价于
// export type FormData = {
//     username: string;
//     password: string;
//     // password2: string;
//     email: string;
// };

// Throws error for `email` and `password`
//  v.parse(FormSchema, {
//   username: "zh_harry",
//   email: "zh_harry@163.com",
//   password: "11111111",
// });

v.parse(OuterSchema, {email: 'jane@example.com', password: '12345678', username: "zh_harry", password2: "12345678"});



