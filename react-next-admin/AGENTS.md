# react-next-admin — 后台管理系统脚手架模板

## 项目概述

基于 Next.js App Router 的**后台管理系统脚手架模板**，用于管理端应用的快速搭建与代码生成。系统本身管理「项目 / 菜单 / 表格配置 / 应用 / 用户示例」等实体，并通过内置的 Coder 模块（`/coder/*.json`）从后端实体/表结构自动生成 CRUD 脚手架代码（Schema + API + 组件 + 页面），属于低代码/代码生成型管理平台。

技术特征：App Router + next-intl 国际化 + shadcn/ui + Tailwind CSS 4 + TanStack Table + valibot/react-hook-form 表单校验，并通过 iframe `postMessage` 实现跨域（跨站点）令牌与登录态共享。

## 核心版本依赖

| 类别 | 依赖 | 版本 | 说明 |
|------|------|------|------|
| 框架 | `next` | **15.5.26** | App Router，Turbopack dev |
| 视图 | `react` / `react-dom` | **^19.0.0**（已装 19.3.0） | React 19 |
| 类型 | `typescript` | **^5** | `strict: false`，`strictNullChecks: true` |
| 国际化 | `next-intl` | **4.14.6** | `[locale]` 路由段 + 静态渲染 |
| 样式 | `tailwindcss` | **^4** | 经 `@tailwindcss/postcss`，无独立 config 文件 |
| 组件库 | `shadcn` (CLI) | **^2.6.0** | style `new-york`，RSC 开启 |
| UI 原语 | `@radix-ui/react-*` | 多组件 | checkbox/dialog/dropdown-menu/label/popover/select/separator/slider/slot/tabs/tooltip |
| 表格 | `@tanstack/react-table` | **^8.21.3** | 服务端分页 + 手动排序/筛选 |
| 表单校验 | `valibot` | **^1.1.0** | Schema 层 |
| 表单 | `react-hook-form` + `@hookform/resolvers` | **^7.57.0** / **^3.9.0** | 组件层 |
| 拖拽 | `@dnd-kit/core` | **^6.3.1** | 表格列排序等 |
| 图标 | `lucide-react` | **^0.511.0** | 配合 shadcn |
| 主题 | `next-themes` | **^0.4.6** | 深浅色切换 |
| 提示 | `react-hot-toast` | **^2.5.2** | 全局 toast |
| 日期 | `react-day-picker` / `dayjs` / `date-fns` | **^9.9.0** / **^1.11.13** / **4.14.6** | 日期组件与格式化 |
| 布局 | `react-resizable-panels` | **^3.0.2** | 可调尺寸面板 |
| 工具 | `clsx` / `tailwind-merge` / `class-variance-authority` | ^2.1.1 / ^3.3.0 / ^0.7.1 | 样式合并 |
| 代码复制 | `cpy-cli` | **^5.0.0** | 从 `../common` 复制共享库 |
| 规范 | `eslint` + `eslint-config-next` | **^9** / **15.5.26** | flat config（eslint.config.mjs） |

> **Node.js**：Next.js 15 要求 **>= 18.18**，官方推荐 **20.x LTS**（`next` engines 为 `^18.18.0 || ^19.8.0 || >=20.0.0`）。**TypeScript**：>= 4.5（本项目 5.x）。

## 目录结构

```
react-next-admin/
├── src/
│   ├── app/                        # App Router 路由
│   │   ├── globals.css             # 全局样式（shadcn CSS 变量）
│   │   └── (i18n)/[locale]/        # 带 locale 前缀的业务页面（唯一路由组）
│   │       ├── layout.tsx          # 根布局：NextIntlClientProvider + AdminRootLayout + Toaster
│   │       ├── page.tsx            # 占位页（"hello"）
│   │       ├── dashboard/ access-history/ app/ menu/
│   │       ├── project-config/ table-config/ user-example/
│   ├── components/                 # 应用层组件
│   │   ├── ui/                     # shadcn/ui 生成的原语组件
│   │   ├── <domain>/{add,edit,search,columns,operation}.tsx  # 各领域 CRUD 组件
│   │   ├── table-config/coder/     # 表格配置的列编辑器/列定义（Coder 相关）
│   │   └── root-layout / app-sidebar / header / version-switcher ...
│   ├── common/                     # ⚠️ 共享库（由 cpy 从 ../common/src/common 复制，勿手改）
│   │   ├── lib/                    # Fetcher / CrosStorage / Env / UrlUtils / admin / protocol / table
│   │   ├── components/             # table(cell/header) / forms / file / i18n / header / 动态渲染
│   │   ├── hook/                   # ReachBottom / CrosStorage / Captcha / Navigating
│   │   └── i18n/                   # next-intl request 配置（multi-request.ts 为生效入口）
│   ├── schema/                     # valibot 校验 Schema（createSchema(translate) 工厂）
│   ├── api/                        # 后端接口封装
│   │   ├── auto/                   # 自动生成的领域 API（menu/table-config/project-config/user-example）
│   │   └── manual/                 # 手写的 Coder API
│   ├── i18n/routing.ts             # next-intl 路由定义（locales/pathnames/cross-site 跳转）
│   └── lib/utils.ts                # shadcn cn() 工具
├── messages/                       # 国际化文案（list.json 索引 + 各领域 en/zh json + en.d.json.ts 类型声明）
├── document/init.md                # 初始化步骤记录
├── next.config.ts                  # 仅挂载 next-intl 插件
├── components.json                 # shadcn 配置
└── package.json
```

> 注：`src/app` 下**无 `middleware.ts`**，也**不再有 `(index)` 路由组**——根路径 `/` 的重定向由 next-intl `routing.pathnames` 的 `/` 映射（指向 WWW 站点）处理。

## 核心架构

### 1. 路由与国际化

- 业务页面全部放在 `src/app/(i18n)/[locale]` 下，通过 next-intl 的 `[locale]` 段实现 en/zh 双语。
- `src/i18n/routing.ts` 定义 `locales: ["en","zh"]`、`defaultLocale: "en"`、`localePrefix: 'as-needed'` 与 `pathnames`。其中 `/`、`/sign-in`、`/sign-up`、`/avatar-editor` 映射到 **WWW / Passport 站点的跨域路径**（经 `WWW_ROOT` / `PASSPORT_ROOT` 拼接）。
- `next.config.ts` 通过 `createNextIntlPlugin` 指定 `requestConfig: ./src/common/i18n/multi-request.ts`——它按 `messages/list.json`（`["default","ProjectConfig","ColumnConfig","TableConfig","menu","UserExample"]`）索引动态合并各领域翻译文件（`default` 平铺、其余按目录名作为命名空间）。
- `layout.tsx` 用 `setRequestLocale` 开启静态渲染，并做 `hasLocale` 校验。

### 2. 共享库 common（cpy 复制机制）

`src/common` 并非本仓库源文件，而是通过 `npm run copy`（`cpy ./../common/src/common ./src/ --parents`）从**父目录 `common` 模块**复制而来，用于在多个前端子项目（react-next-admin / react-next-im / react-next-passport 等）间共享同一套底层能力。**修改需回源到 `../common/src/common`，不要直接改 `src/common` 的副本。**

`../common` 本身已是一个**独立的 Next.js 应用**，除共享库外还带一组演示/示例页面（`src/app/[locale]/` 下的 access-histories、draggable、error、forms、hooks、loading、table、upload），并有自己的 `middleware.ts` 与更全的依赖（axios、swr、react-markdown、remark-gfm、motion-plus、@dnd-kit/utilities 等），可作为共享组件的独立预览环境。

### 3. 数据请求 Fetcher（`src/common/lib/Fetcher.ts`）

统一 `fetch` 封装，`get`/`post` 均以对象参数调用：相对路径自动拼接 `API_BASIC_URL`、从 `CrosStorage.getCrosStorage()` 取 token 写入 `Authorization` 头；响应按 `Result` 协议解析（`code !== "0"` 判错），失败时经 `translator` 翻译后 `toast.error`，`user_not_login` 时触发 `redirectToLogin`。支持 `withCookie`（`credentials: "include"`）与自定义 `crosStorage`/`translator`。

### 4. 跨域存储 CrosStorage（`src/common/lib/CrosStorage.ts`）

跨站点（admin / passport / www 不同子域）共享登录态：非跨域时直用 `localStorage/sessionStorage`；跨域时（`UrlUtils.isCros` 判定）创建隐藏 iframe 指向 `NEXT_PUBLIC_STORAGE_PROXY`，通过 `postMessage` 收发 `StorageRequest/Response`（`CrosProtocol` 定义 `CommandType`/`StorageType`）完成 token 读写，实现单点登录态打通。

### 5. 协议与类型（`src/common/lib/protocol/`）

- `Result` / `PagerResult`：后端统一响应（`code`/`message`/`data`/`key`）与分页结构。
- `Identity`：`IDENTITY = string | number` 实体主键别名。
- `LoginUser`：登录用户模型 + `logout`。
- `Status`：`"ENABLE" | "DISABLE"`。
- `KeyValue`、`ArrayBufferUtils`、`CrosProtocol`：KV / 二进制 / 跨域消息协议。

### 6. Admin 状态（`src/common/lib/admin/`）

`AdminBroker` + `AccessHistoryContainer` + `AccessLog` + `AdminContextProvider` 构成轻量管理端状态中枢：记录访问历史（面包屑/最近访问）、导航跳转。`AdminBroker` 维护 `listeners` 集合，`subscribe`/`access` 变更后通过 `newMessageSignal` 回调触发 React 重渲染（`root-layout.tsx` 中 `setAdminContextValue(localContext.newReference())` 刷新 context 值）。

### 7. 表格系统（`src/common/components/table/`）

`DataTable`（`data-table.tsx`）基于 TanStack Table，采用**服务端分页 + 手动排序/筛选**；单元格渲染（`cell/`：input/select/date/currency/tree/operation/check-box/normal 等）、表头（`header/`：排序、列过滤、复选框）、分页（`pager.tsx`/`pagination.tsx`）拆分为独立组件，由领域层 `columns.tsx` 组装。`src/common/lib/table/` 提供 `DataTableProperty` 与 `TableUtils` 支撑列定义与表格工具。

### 8. 三层 CRUD 脚手架模式

每个领域实体（menu / table-config / project-config / user-example）遵循统一分层：

```
schema/<entity>.ts        → valibot 校验规则（createSchema(translate) 工厂）
api/auto/<entity>.ts      → 后端接口（search/save/delete/batchDelete/enable/disable）
components/<entity>/      → add / edit / search / columns / operation
app/(i18n)/[locale]/<entity>/page.tsx  → 页面装配
```

`CoderApi`（`src/api/manual/coder.ts`）提供 `initByLocal / initByJpa / generate / initScaffold / clearScaffold`，用于从后端实体生成上述三层代码，是「脚手架模板」的核心能力。所有领域 API 均遵循 `translator` + `redirectToLogin` 双回调注入模式（由页面层 `useTranslations`/`useRouter` 提供）。

### 9. 环境变量（`src/common/lib/Env.ts`）

所有 `NEXT_PUBLIC_*` 环境变量在 `Env.ts` 集中读取并导出（`API_BASIC_URL`、`TOKEN_KEY`、`TOKEN_STORAGE`、`STORAGE_PROXY`、`PASSPORT_ROOT`、`WWW_ROOT`、`ADMIN_ROOT`、`UPLOAD_URL`、`WEBSOCKET` 等），其余代码只 import `Env` 而不直接读 `process.env`。开发/生产分别由 `.env.development` / `.env.production` 提供。

## 开发命令

```bash
yarn dev      # next dev --turbopack -p 3002
yarn build    # next build
yarn start    # next start
yarn lint     # next lint
yarn copy     # cpy ./../common/src/common ./src/ --parents（同步共享库）
```

> 端口约定：admin=3002、passport=3000、www=3001（见 `.env.development` 的 `NEXT_PUBLIC_*_ROOT`）。

## 当前静态部署约定（优先于上文历史描述）

- 使用 Next.js 15.5.26 / next-intl 4.14.6，`output: "export"` 和 `trailingSlash: true`，产物 `out/`。开发缓存 `.next-dev`，生产缓存 `.next`。
- 默认语言 `zh`；显式 `/zh/`、`/en/`，已移除 `pathnames` 跨站重写。根 `(index)` 为静态语言偏好入口；外站链接显式使用配置的 origin 与 locale。
- 开发端口：common 3000、passport 3001、admin 3002、IM 3003。生产管理站为 `http://admin.sparrowzoo.com`，`coder` 是 Nginx 兼容别名。
- 使用 npm / package-lock.json 构建发布；`npm start` 只预览静态产物，线上不用 Next 服务。共享源修改后继续 `npm run copy`。
- 上线操作以 `common/public/backend/nginx/next15-http-launch.html` 为准。
