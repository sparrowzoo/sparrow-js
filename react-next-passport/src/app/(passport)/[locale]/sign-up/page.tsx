"use client";
import Image from "next/image";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Passport.sign-up");
  return (
    <>
      <div className="container flex h-full w-full flex-row">
        <div className="hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="flex flex-row items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Sparrow zoo
          </div>
          <div className="flex h-full w-full flex-col items-center justify-center">
            <Image
              src="/brand/sparrow4.jpg"
              alt="Image"
              width="1000"
              height="0"
              className="h-fit w-full object-cover dark:brightness-[0.8] dark:grayscale"
            />
          </div>
        </div>
        <div className="flex min-h-screen w-full flex-col items-center justify-center lg:p-8">
          <div className={"sr-only"}>水平垂直居中,宽度由下边的350确定</div>
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t("sign-up-title")}
              </h1>
            </div>
            <AuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
