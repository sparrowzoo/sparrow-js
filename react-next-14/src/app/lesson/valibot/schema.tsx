import * as v from "valibot";

export type FormData = {
  username: string;
  password: string;
  // password2: string;
  email: string;
};
export const FormSchema = v.object({
  username: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your email."),
    v.email("The email address is badly formatted.")
  ),
  email: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your email."),
    v.email("The email address is badly formatted."),
    v.endsWith("@163.com")
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your password."),
    v.minLength(8, "Your password must have 8 characters or more.")
  ),
  // password2: v.string(),
});

v.parse(FormSchema, {
  username: "zh_harry",
  email: "zh_harry@163.com",
  password: "11111111",
});
