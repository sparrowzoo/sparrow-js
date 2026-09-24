"use client";

import {useState} from "react";
import {ArrowRight, LoaderCircle} from "lucide-react";
import {useForm, type SubmitHandler} from "react-hook-form";
import {valibotResolver} from "@hookform/resolvers/valibot";
import {useLocale, useTranslations} from "next-intl";
import toast from "react-hot-toast";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {type FormData, SignInFormSchema} from "@/schema/sign-in";
import signIn from "@/api/signin";
import useCaptcha from "@/common/hook/CaptchaHook";
import useCrosStorage from "@/common/hook/CrosStorageHook";
import useNavigating from "@/common/hook/NavigatingHook";
import UrlUtils from "@/common/lib/UrlUtils";
import FindPassword from "@/components/password/Find";
import AuthShell from "@/components/passport/auth-shell";
import CaptchaImage from "@/components/passport/captcha-image";
import styles from "@/components/passport/passport.module.css";
import useAuthSuffix from "@/components/passport/use-auth-suffix";

export default function SignInPage() {
    const t = useTranslations("Passport.sign-in");
    const locale = useLocale();
    const authSuffix = useAuthSuffix();
    const {redirectTo} = useNavigating();
    const [isLoading, setIsLoading] = useState(false);
    const captchaRef = useCaptcha();
    const crosStorage = useCrosStorage();
    const {register, setValue, handleSubmit, formState: {errors}} = useForm<FormData>({
        mode: "onChange",
        defaultValues: {userName: "", password: "", captcha: "", rememberMe: false},
        resolver: valibotResolver(SignInFormSchema, {abortEarly: false}),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const result = await signIn(data, t);
            if (!crosStorage) throw new Error("Login storage is not ready");
            await crosStorage.setToken(result.data.token);
            toast.success(t("sign-in-success"));
            setTimeout(() => redirectTo(UrlUtils.getQueryString() || ""), 2000);
        } catch (error) {
            // Business errors are translated by Fetcher; network failures still need feedback.
            if (error instanceof Error) toast.error(t("system_server_error"));
        } finally {
            setIsLoading(false);
        }
    };

    return <AuthShell variant="sign-in" title={t("sign-in-title")} description={t("sign-in-title2")}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={isLoading}>
            <div className={styles.field}>
                <Label htmlFor="userName" className={styles.label}>{t("username")}</Label>
                <Input {...register("userName")} id="userName" type="text" autoComplete="username" autoCapitalize="none" autoCorrect="off"
                       placeholder={t("username-placeholder")} className={styles.input} aria-invalid={Boolean(errors.userName)} aria-describedby={errors.userName ? "username-error" : undefined}/>
                {errors.userName && <p className={styles.fieldError} id="username-error" role="alert">{errors.userName.message}</p>}
            </div>
            <div className={styles.field}>
                <div className={styles.labelRow}><Label htmlFor="password" className={styles.label}>{t("password")}</Label><FindPassword/></div>
                <Input {...register("password")} id="password" type="password" autoComplete="current-password" className={styles.input}
                       placeholder={t("password-placeholder")} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : undefined}/>
                {errors.password && <p className={styles.fieldError} id="password-error" role="alert">{errors.password.message}</p>}
            </div>
            <div className={styles.field}>
                <Label htmlFor="captcha" className={styles.label}>{t("captcha")}</Label>
                <div className={styles.captchaRow}>
                    <Input {...register("captcha")} id="captcha" type="text" autoComplete="off" autoCapitalize="none" className={styles.input}
                           placeholder={t("captcha-placeholder")} aria-invalid={Boolean(errors.captcha)} aria-describedby={errors.captcha ? "captcha-error" : undefined}/>
                    <CaptchaImage imageRef={captchaRef} alt={t("captcha")} refreshLabel={t("captcha-refresh")} disabled={isLoading}/>
                </div>
                {errors.captcha && <p className={styles.fieldError} id="captcha-error" role="alert">{errors.captcha.message}</p>}
            </div>
            <div className={styles.rememberRow}>
                <Checkbox id="rememberMe" defaultChecked={false} onCheckedChange={(value) => setValue("rememberMe", value === true)}/>
                <label htmlFor="rememberMe">{t("remember-me")}</label>
            </div>
            <Button type="submit" disabled={isLoading} className={styles.primaryButton}>
                {isLoading ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true"/> : null}
                {isLoading ? t("submitting") : t("sign-in")}
                {!isLoading && <ArrowRight size={16} aria-hidden="true"/>}
            </Button>
        </form>
        <div className={styles.formSwitch}><span>{t("to-sign-up")}</span><a href={`/${locale}/sign-up/${authSuffix}`}>{t("sign-up")}</a></div>
    </AuthShell>;
}
