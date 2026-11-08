"use client";

import {useTranslations} from "next-intl";
import Header, {type HeaderProps} from "@/common/components/header/header";
import menuRegistry from "./menu";

/** 在客户端注入业务菜单，避免跨服务端边界传递实例和翻译函数。 */
export default function SparrowHeader(props: Omit<HeaderProps, "menuRegistry" | "translator">) {
    const translator = useTranslations("product");
    return <Header {...props} menuRegistry={menuRegistry} translator={translator}/>;
}
