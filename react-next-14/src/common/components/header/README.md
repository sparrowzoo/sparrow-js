# 共享站点 Banner

`site-banner.tsx` 统一实现 Logo、菜单、主题切换、中英文切换和移动端折叠菜单。
样式在 `site-banner.module.css` 中独立维护，不依赖首页样式。
官网 `SiteHeader` 和产品 `Header` 仅负责品牌、菜单和操作区的配置，共用这一套布局。
后续产品优先使用 `header.tsx`，通过 props 配置自己的品牌与导航。

## 产品统一入口

`HeaderProps` 继承 `SiteBannerProps` 的全部可选属性，并额外保留 `showProfile?: boolean`：

| 属性 | 用途 / 默认值 |
| --- | --- |
| `brandName` / `brandCaption` | 产品名称与副标题；名称默认 `Sparrow Zoo` |
| `logo` / `logoSrc` | React 图标或宿主图片路径；未指定时使用内置 `Package2` |
| `homeHref` | 品牌链接，默认 `/` |
| `items` | 产品导航；传入 `[]` 可隐藏导航项；省略时启用原有业务菜单 |
| `actions` | 额外操作区，例如登录按钮或帮助入口 |
| `showProfile` | 追加用户菜单，默认 `false`；与 `actions` 可同时使用 |
| `navigationLabel` / `openMenuLabel` / `closeMenuLabel` | 可选无障碍文案，默认随当前中英文语言切换 |
| `className` | 产品对 Banner 外层的样式扩展 |

例如 Passport 可在公共 layout 中只渲染一次：

```tsx
import Header from "@/common/components/header/header";
import {ShieldCheck} from "lucide-react";
import {getProductNavigation} from "@/common/components/header/product-navigation";

<Header
    brandName="Sparrow Passport"
    brandCaption="统一身份认证"
    logo={<ShieldCheck size={28} aria-hidden="true" />}
    homeHref="/sign-in"
    items={[
        {label: "官网", href: "https://www.sparrowzoo.com"},
        ...getProductNavigation(locale),
        {label: "创建账号", href: "/sign-up", emphasized: true},
    ]}
/>
```

实际宿主应传入翻译后的文案，官网地址从 `Env.WWW_ROOT` 构造并包含所需语言路径。
`items` 一旦传入，`Header` 不读取原有业务导航的翻译键。
本地链接保留宿主 next-intl 路由类型检查，HTTP(S) 绝对地址使用普通链接，不要求添加到宿主 `pathnames`。
`homeHref` 同样支持本地路由和 HTTP(S) 绝对地址。

## 原有业务调用

`header.tsx` 保留默认导出和 `HeaderProps`，旧调用无需修改：

```tsx
import Header from "@/common/components/header/header";

<Header />
<Header showProfile />
```

兼容入口通过 `getProductNavigation(locale)` 显示 IM、代码生成器、Passport 的真实应用入口；学员入口作为普通菜单项独立放在末尾，
首页指向 `WWW_ROOT`，并保留博客、客服、商城、写文章业务菜单；
宿主配置了 `pathnames` 时，仅显示其中已声明的路由，避免跨产品出现失效入口。
继续读取宿主的 `Header` 翻译。`showProfile` 默认为 `false`，设为 `true` 时通过操作区插槽渲染 `UserProfile`。
品牌使用内置 `Package2` 图标，不依赖宿主的 public 图片。

## 当前官网复用

官网菜单集中在 `src/app/[locale]/_components/site-header.tsx`。产品页可直接引用：

```tsx
import SiteHeader from "@/app/[locale]/_components/site-header";

export default function ProductPage() {
    return (
        <>
            <SiteHeader />
            <main>{/* 产品内容 */}</main>
        </>
    );
}
```

若同一组页面在共享 layout 中渲染 Banner，页面内无需重复渲染。
当前官网、Passport 与 IM 使用同一份产品导航。IM、代码生成器、Passport 直接打开应用，开发文档使用带首页路径的 hash 链接。
官网将学员入口直接配置为 `href: "/study"`，保留本地学习路由、中英文切换和当前页高亮；
产品应用在菜单配置中使用 `WWW_ROOT` 构造学员入口，中文指向 `/study`，英文指向 `/en/study`。
官网产品介绍页复用 `SiteHeader`，无需重复添加入口。
Coder 管理端保留工作台 Header，在历史导航右侧直接配置同一学员入口的地址和文案，
无需为了一个导航项迁移工作台布局。

## 宿主项目自定义

```tsx
import Header from "@/common/components/header/header";
import UserProfile from "@/common/components/header/user-profile";
import {Package2} from "lucide-react";

<Header
    brandName="麻雀窝"
    brandCaption="Sparrow Zoo"
    logo={<Package2 size={28} aria-hidden="true" />}
    homeHref="/"
    navigationLabel="主导航"
    openMenuLabel="打开导航菜单"
    closeMenuLabel="关闭导航菜单"
    items={[
        {label: "产品", href: {pathname: "/", hash: "products"}},
        {label: "开发文档", href: {pathname: "/", hash: "docs"}},
        {label: "组件示例", href: "/ui", emphasized: true},
    ]}
    actions={<UserProfile />}
/>
```

实际使用时由页面传入翻译后的品牌与菜单。`SiteBanner` 不依赖官网的 `website` 翻译命名空间。
`navigationLabel`、`openMenuLabel`、`closeMenuLabel` 可省略，默认按当前中英文语言提供无障碍标签；也可由宿主覆盖。
`items` 的本地路由使用项目的 next-intl `Link`，HTTP(S) 绝对地址使用普通链接；
可通过 `active` 指定当前菜单项，`emphasized` 突出入口。
`logo` 接收 React 节点，优先于 `logoSrc`；`actions` 接收用户菜单等额外操作，不影响内置主题与语言切换。

宿主需沿用 `ThemeProvider`（`attribute="class"`）和 `NextIntlClientProvider`，
提供原有 `Header` 主题文案与 `LocaleSwitcher` 翻译，以及 `@/i18n/routing` 配置。
`Header` 未传 `logo` / `logoSrc` 时使用内置图标；`SiteBanner` 直接调用时的默认图片路径为 `/svg/brand/sparrow-logo.svg`。
使用图片 Logo 时由宿主的 public 目录提供对应文件。

共享代码的权威源码是 `common/src/common`，修改应在此进行；不要直接修改宿主 `src/common` 副本。
宿主的 `npm run copy` 只复制共享源码，不复制官网 public 资源或 messages。
跨项目复用时可用 `logo` 提供图标，或通过 `logoSrc` 指向宿主已有资源，并沿用宿主的菜单与路由配置。

`ModeToggle` 可传 `className` / `contentClassName`，语言组件可传 `className` / `selectClassName` / `contentClassName`。
语言组件使用与主题切换一致的下拉菜单；`className` 控制外层容器，`selectClassName` 为兼容原有调用保留，现作用于按钮触发器，`contentClassName` 控制菜单浮层。
触发器按所有语言的最长文案预留宽度，切换时避免控件与相邻按钮跳动。
主题支持浅色、深色、跟随系统；切换语言保留当前路径、重复查询参数、页面锚点及滚动位置。

## 产品地址配置

产品地址集中读取于 `common/src/common/lib/Env.ts`，页面和导航不要直接读取环境变量或硬编码域名。
`common/src/common/lib/ProductRegistry.ts` 中的 `productRegistry` 是以产品 id 为 key、`Product` 为 value 的映射，
保存产品可用状态及 `landing`（介绍页）/ `live`（真实入口）地址，可通过 `productRegistry.passport` 等方式直接访问。
导航按映射的声明顺序排列：Passport、IM、代码生成器、File、UI、Security；未开放或缺少目标地址的产品不显示。
学员入口直接写在宿主的菜单配置中。

产品名称独立配置在 `common/messages/product/en.json` 与 `zh.json`，键与产品 id 一致，
由 `messages/list.json` 注册为 `product` 命名空间。新增产品时同步补齐两种语言。
`getProductUrl(id, locale)` 按产品 id 直接返回真实入口地址并替换语言占位符，未配置入口时返回 `undefined`。
`getProductNavigations(t, locale, live, tProduct)` 从 `@/common/lib/protocol/ProductNavigation` 导出，
返回可直接传入 Banner 的菜单；`live=false` 使用介绍页，`live=true` 使用真实入口并在前面添加官网。
第四个参数负责产品名称翻译，第一个参数仅在 `live=true` 时通过 `t("home")` 读取宿主的官网文案：

```tsx
const t = useTranslations("Passport.navigation");
const tProduct = useTranslations("product");
const locale = useLocale();
const items = getProductNavigations(t, locale, true, tProduct);
```

宿主升级时应先准备并加载 `product` 命名空间，再执行 `npm run copy` 同步共享源码并更新调用处的第四个参数。
`copy` 不会复制 messages：使用 `multi-request.ts` 的宿主需复制 `messages/product/{en,zh}.json` 并在 `messages/list.json` 注册 `product`；
使用单文件 `request.ts` 的 Passport、IM 等宿主需将对应语言的产品文案合入 `messages/{locale}.json` 的 `product` 字段，
或在其消息加载配置中将独立产品文件合并为该命名空间。

| 环境变量 | 本地地址 | 用途 |
| --- | --- | --- |
| `NEXT_PUBLIC_WWW_ROOT` | `http://localhost:3000` | 官网 |
| `NEXT_PUBLIC_IM_ROOT` | `http://localhost:3003` | IM 真实入口 |
| `NEXT_PUBLIC_ADMIN_ROOT` | `http://localhost:3002` | 代码生成器入口 |
| `NEXT_PUBLIC_PASSPORT_ROOT` | `http://localhost:3001` | Passport 入口 |

各消费项目的 `.env.development` 配置本地地址，`.env.production` 预留线上地址并标注 TODO。
上线前确认三个真实产品域名；`NEXT_PUBLIC_*` 在构建时写入前端，修改后需重新启动开发服务或重新构建发布。
Passport 简介保留单体体验地址，前后端分离体验使用 `PASSPORT_ROOT`。

## 末尾快捷入口

`BannerMenuItem.group: "utility"` 将链接独立排列在导航末尾。官网将学员入口与 Playground 并排，
桌面使用细分隔线区分产品导航，移动菜单使用双列按钮。
`icon: "graduation-cap" | "flask"` 使用可跨服务端边界传递的图标标识，分别显示学位帽和实验瓶；文字标签始终保留。
学员入口和 Playground 使用相同的菜单项配置，无需为单个入口定义辅助方法：

```tsx
items={[
    // 其他导航项……
    {label: t("nav.study"), href: "/study", icon: "graduation-cap", group: "utility"},
    {label: t("nav.playground"), href: "/ui", icon: "flask", group: "utility"},
]}
```

宿主直接配置翻译文案与目标地址，共享 Banner 负责图标和分组排版。

学员入口文案放入宿主的中英文消息文件，菜单直接使用 `t("study")`（官网使用 `t("nav.study")`），不在组件中判断语言后写死文案。
