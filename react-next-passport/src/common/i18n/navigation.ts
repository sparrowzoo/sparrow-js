import {createNavigation} from "next-intl/navigation";
// @ts-ignore
import {routing} from "@/i18n/routing";

export const {Link, getPathname, redirect, usePathname, useRouter} =
    createNavigation(routing);

