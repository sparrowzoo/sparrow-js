import { ReactNode } from "react";

export default function Layout({
  team,
  analytics,
  children,
}: {
  team: ReactNode;
  analytics: ReactNode;
  children: ReactNode;
}) {
  const isLogin = false;
  return (
    <>
      <h1>平行路由</h1>
      <p>
        平行路由的使用方式就是将文件夹以 @作为开头进行命名，这个文件夹下面的
        page.js 将会自动注入文件夹同级 layout 的 props 中。
        平行路由跟路由组一样，不会影响 URL。比如 /@team/members 对应的地址是
        /members。
      </p>

      <div>{isLogin ? team : "没登录啊 兄弟"}</div>
      <div> {children}</div>
      <div> {analytics}</div>
    </>
  );
}
