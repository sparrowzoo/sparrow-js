"use client";
import { NextIntlClientProvider } from "next-intl";
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";

type Props = {
  locale: string;
  messages: Record<string, any>;
  DynamicComponent: React.ComponentType<any>;
  containerId: string;
};
//https://next-intl.dev/docs/usage/configuration#server-client-components
export default function HtmlFragment(props: Props) {
  const { locale, messages, containerId, DynamicComponent } = props;
  useEffect(() => {
    // 手动挂载到指定容器
    const container = document.getElementById(containerId);
    if (container) {
      const root = createRoot(container);
      root.render(
        <NextIntlClientProvider locale={locale} messages={messages}>
          <DynamicComponent />
        </NextIntlClientProvider>
      );
    }
  }, []);
  return null; // 返回空值，避免自动生成默认 div
}
