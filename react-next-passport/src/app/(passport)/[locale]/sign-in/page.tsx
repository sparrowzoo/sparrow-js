"use client";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {SubmitHandler, useForm} from "react-hook-form";
import {FormData, SignInFormSchema} from "@/schema/sign-in";
import {valibotResolver} from "@hookform/resolvers/valibot";
import * as React from "react";
import signIn from "@/api/signin";
import toast, {Toaster} from "react-hot-toast";
import {Icons} from "@/components/ui/icons";
import {ErrorMessage} from "@hookform/error-message";
import {Checkbox} from "@/components/ui/checkbox";
import useCaptcha from "@/common/hook/CaptchaHook";
import useCrosStorage from "@/common/hook/CrosStorageHook";
import Result from "@/common/lib/protocol/Result";
import UrlUtils from "@/common/lib/UrlUtils";
import FindPassword from "@/components/password/Find";
import {Link} from "@/common/i18n/navigation";
import {useTranslations} from "next-intl";
import useNavigating from "@/common/hook/NavigatingHook";

export default function Page() {
    const {redirectTo} = useNavigating();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const t = useTranslations("Passport.sign-in");

    const captchaRef = useCaptcha();
    let crosStorage = useCrosStorage();
    const directUrl = UrlUtils.getQueryString();
    const {
        register,
        setValue,
        handleSubmit,
        formState: {errors},
    } = useForm<FormData>({
        mode: "onChange",
        //相当于v.parse
        resolver: valibotResolver(
            SignInFormSchema,
            //https://valibot.dev/guides/parse-data/
            {abortEarly: false}
        ), // Useful to check TypeScript regressions
    });

    function onRememberMeChange(value: any) {
        setValue("rememberMe", value);
    }

    const onSubmit: SubmitHandler<FormData> = (
        data: FormData,
        event: React.BaseSyntheticEvent | undefined
    ) => {
        debugger;
        setIsLoading(true);
        signIn(data, t)
            .then((result: Result) => {
                crosStorage?.setToken(result.data.token);
                setIsLoading(false);
                toast.success(t("sign-in-success"));
                setTimeout(() => {
                    redirectTo(directUrl as string);
                }, 2000);
            })
            .catch((error: any) => {
                setIsLoading(false);
            });
    };

    return (
        <div className="w-full text-left">
            <Toaster position="top-center" reverseOrder={false}/>
            <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-full">
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">{t("sign-in-title")}</h1>
                            <p className="text-balance text-muted-foreground">
                                {t("sign-in-title2")}
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="userName">{t("username")}</Label>
                                <Input
                                    {...register("userName")}
                                    id="userName"
                                    type="text"
                                    placeholder={t("username")}
                                />
                                <ErrorMessage
                                    errors={errors}
                                    name="userName"
                                    render={({message}: { message: string }) => (
                                        <p className="text-red-700 text-sm">{message}</p>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">{t("password")}</Label>
                                    <FindPassword/>
                                </div>
                                <Input
                                    {...register("password")}
                                    id="password"
                                    type="password"
                                />
                                <ErrorMessage
                                    errors={errors}
                                    name="password"
                                    render={({message}: { message: string }) => (
                                        <p className="text-red-700 text-sm">{message}</p>
                                    )}
                                />
                            </div>

                            <div className="flex-col items-left ">
                                <Label className="w-32" htmlFor="captcha">
                                    {t("captcha")}
                                </Label>
                                <div className="flex flex-row items-left cursor-pointer">
                                    <Input
                                        {...register("captcha")}
                                        className="w-32"
                                        id="captcha"
                                        type="text"
                                    />
                                    <img
                                        ref={captchaRef}
                                        alt="captcha"
                                        className="w-16 h-8 cursor-pointer invisible"
                                    />
                                </div>
                                <ErrorMessage
                                    errors={errors}
                                    name="captcha"
                                    render={({message}: { message: string }) => (
                                        <p className="text-red-700 text-sm">{message}</p>
                                    )}
                                />
                            </div>
                            <div className="flex flex-row-reverse gap-2">
                                <Checkbox
                                    defaultChecked={false}
                                    onCheckedChange={onRememberMeChange}
                                    id="rememberMe"
                                />
                                <label
                                    htmlFor="rememberMe"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {t("remember-me")}
                                </label>
                                <ErrorMessage
                                    errors={errors}
                                    name="rememberMe"
                                    render={({message}: { message: string }) => (
                                        <p className="text-red-700 text-sm">{message}</p>
                                    )}
                                />
                            </div>
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                className="cursor-pointer"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                )}
                                {t("sign-in")}
                            </Button>
                            <Button variant="outline" className="w-full">
                                {t("sign-in-with-wechat")}
                            </Button>
                        </div>

                        <div className="mt-4 text-center text-sm">
                            {t("to-sign-up")}
                            <Link href="/sign-up" className="underline">
                                {t("sign-up")}
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="hidden h-full bg-muted lg:block">
                    <Image
                        src="/brand/sparrow2.jpg"
                        alt="Image"
                        width="1200"
                        height="0"
                        className="h-full w-full object-cover dark:brightness-[0.8] dark:grayscale"
                    />
                </div>
            </div>
        </div>
    );
}
