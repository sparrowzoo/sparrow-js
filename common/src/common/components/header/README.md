# 共享页头与菜单注册

`Header` 保留 `i18n`、`profile`、`brandCaption`、`homePath`、`live` 的原有功能及默认值。
菜单由上游传入的 `menuRegistry` 提供，翻译函数 `translator?: (key: string) => string` 也由上游提供；省略时直接显示 label。
共享 Header 仍使用 `Header` 消息空间显示品牌；账户、主题和语言控件的依赖保持不变。

## 注册菜单

```tsx
import {MenuRegistry} from "@/common/lib/MenuRegistry";

const menuRegistry = new MenuRegistry();
menuRegistry.register([
    {
        id: "orders",
        label: "orders",
        available: true,
        entry: {landing: "/lang/orders/about/", live: "/lang/orders/"},
    },
]);
```

- id 是 string，不限制业务类别。
- register 整组替换，空数组清空；同组重复 id 抛错并保留原配置。
- 注册器复制输入菜单及 entry，后续修改输入不会改变注册结果。
- getMenuNavigations(locale, live, translator) 按注册顺序过滤不可用项及缺失入口，选择 landing/live，将 `/lang/` 替换为语言目录并翻译 label。
- active、emphasized、icon、group 的现有展示行为保持不变。
- 每个应用持有自己的实例，不在共享库中导出全局业务实例。
- 注册必须在渲染之前完成。修改实例不会自动触发 React 更新；动态菜单应由上游创建新实例再传入，不在 useEffect 中注册。

## 客户端接入

```tsx
"use client";
import {useTranslations} from "next-intl";
import Header from "@/common/components/header/header";
import menuRegistry from "./menu";

export default function ApplicationHeader() {
    const translator = useTranslations("navigation");
    return <Header menuRegistry={menuRegistry} translator={translator}/>;
}
```

类实例及翻译函数不能作为 Server Component 向 Client Component 传递的参数。应在上述客户端入口中导入注册器并获取翻译，再调用共享 Header。服务端布局只渲染 ApplicationHeader。

## Sparrow 唯一配置源

- `common/src/sparrow/menu.ts`：唯一菜单配置 `sparrowMenus`，集中注册并默认导出实例；主站产品页也从此读取产品入口。
- `common/src/sparrow/header.tsx`：客户端入口，注入注册器和 product 翻译。调用方原有 Header 参数不变。
- 主站直接使用源目录，admin/coder/chat/passport 使用同步生成的 `src/sparrow` 副本。
- admin/coder 保留自身后台页头，不接入 Sparrow 产品导航。
- 凌卓只接收通用目录，菜单由其应用自行注册。

## 统一同步

在仓库根目录执行：

```sh
yarn --cwd common copy --dry-run
yarn --cwd common copy
yarn --cwd common copy sparrow-chat sparrow-passport
yarn --cwd common copy ling-admin ling-www
```

默认一次分发到 admin、coder、chat、passport、ling-admin、ling-www 六站；四个 Sparrow 子站点额外接收 `src/sparrow`。也可传站点名只分发指定站点。
唯一脚本是 `common/copy-shared.mjs`。在 common 目录直接运行 `yarn copy` 即完成分发，不需要子站点再次复制。子站点不再提供 copy 命令。
构建脚本在构建前从 common 统一分发所需站点一次。原文章页头复制命令保留为 `yarn copy:article-header`。
目标路径根据脚本位置确定，不依赖执行目录；写入前检查全部目标和源目录，缺失会报错而不会静默跳过。分发后逐文件核对内容，全部成功才输出完成统计。
脚本覆盖同名文件但不删除其他文件，不复制 public 或 messages。源文件删除时需要另行核实并清理下游旧副本。

共享目录 `src/common` 与 Sparrow 目录 `src/sparrow` 均只能回源修改，下游副本不单独维护。
