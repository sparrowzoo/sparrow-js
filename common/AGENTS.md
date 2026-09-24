# common — sparrowzoo 官方站点前端（含下游共享基础库与 UI）

## 项目概述

本目录是 **sparrowzoo 的官方站点前端**，同时承载 Sparrow 生态各子项目（react-next-admin / react-next-im / react-next-passport / react-webpack 等）共享的**基础库与 UI 组件**。

`src` 目录中**除 `app` 之外全部是下游共享代码**（相当于本平台的基础库 + UI），会通过 `cpy` 复制进各子项目复用，涵盖：数据请求、跨域登录态共享、WebSocket 长连接、后台管理状态、通用表格系统、表单/文件/国际化/头部等 React 组件，以及自定义 hooks。

- `src/app/` — 本站（sparrowzoo 官方站点）自身的业务页面，**不属于共享代码**
- `src/common/` — 共享库本体，被 `cpy` 复制进各子项目的 `src/common`（见下）
- `src/components/` `src/hooks/` `src/lib/` `src/i18n/` — shadcn/ui 原语、工具与国际化脚手架，作为 `@/` 导入目标（各子项目自行生成等价副本）

## 跨项目复制机制（cpy）

子项目（以 react-next-admin 为例）通过 `npm run copy`（`cpy ./../common/src/common ./src/ --parents`）把 `../common/src/common` 整目录复制进自身的 `src/common`。`copy` 脚本定义在**各子项目**的 `package.json` 中，方向是「从 common 拉取 → 覆盖子项目自身」。

由此产生两条**关键约定**：

1. **修改必须回源，然后 copy**：共享代码的权威源码在 `common/src/common`，子项目里的 `src/common` 只是副本，禁止直接改动（否则下次 copy 会被覆盖）。**下游项目若要修改任何共享内容，一定要回到本目录（common）修改，改完后到子项目执行 `npm run copy` 同步。**
2. **对外部宿主项目的依赖倒置**：common 代码里大量 `@/` 导入指向的是**宿主项目**的路径，这些文件在 common 仓库里可能不存在或只是占位，复制进子项目后才真正解析。常见的有：
   - `@/i18n/routing` — next-intl 路由定义（`locales` / `pathnames`），由宿主项目提供
   - `@/components/ui/*` — shadcn/ui 原语组件（button/table/select/input/dialog/dropdown-menu/sidebar 等）
   - `@/lib/utils` — `cn()` 样式合并工具
   - `@/hooks/use-mobile` — 移动端断点 hook

## 核心版本依赖

| 类别 | 依赖 | 版本 | 说明 |
|------|------|------|------|
| 框架 | `next` | **15.5.26** | App Router，Turbopack dev |
| 视图 | `react` / `react-dom` | **^19.0.0** | React 19 |
| 类型 | `typescript` | **^5** | `strict: false`（见 tsconfig） |
| 国际化 | `next-intl` | **4.14.6** | 显式 `[locale]` 路由段、静态导出 |
| 样式 | `tailwindcss` | **^4** | 经 `@tailwindcss/postcss`，无独立 config 文件 |
| 组件库 | `shadcn` (CLI) | **^2.6.0** | style `new-york`，baseColor `stone`，RSC 开启 |
| UI 原语 | `@radix-ui/react-*` | 多组件 | checkbox/dialog/dropdown-menu/label/popover/select/separator/slot/tooltip |
| 表格 | `@tanstack/react-table` | **^8.21.3** | 手动分页 + 排序/筛选 |
| 表单 | `react-hook-form` | **^7.60.0** | 校验表单组件 |
| 拖拽 | `@dnd-kit/core` / `utilities` | **^6.3.1** / **^3.2.2** | 通用拖拽容器 |
| 请求 | `axios` | **^1.9.0** | 文件上传等场景 |
| 数据 | `swr` | **^2.3.3** | DynamicRender 动态渲染 |
| 动画 | `motion` / `motion-plus` | **^11.x** | Loading/Error 动画 |
| 图标 | `lucide-react` | **^0.513.0** | 配合 shadcn |
| 主题 | `next-themes` | **^0.4.6** | 深浅色切换 |
| 提示 | `react-hot-toast` | **^2.5.2** | 全局 toast |
| 日期 | `dayjs` / `date-fns` | **^1.11.13** / **^4.1.0** | 日期格式化 |
| 工具 | `clsx` / `tailwind-merge` / `class-variance-authority` | ^2.1.1 / ^3.3.0 / ^0.7.1 | 样式合并 |

## 目录结构

```
common/
├── src/
│   ├── app/[locale]/          # 本地调试用的最小 App Router 骨架
│   ├── components/ui/         # shadcn/ui 原语组件（button/table/select/…）
│   ├── lib/utils.ts           # cn() 工具
│   ├── hooks/use-mobile.ts    # 移动端断点
│   └── common/                # ⚠️ 共享库本体（被 cpy 复制进各子项目）
│       ├── lib/               # 底层能力（见下）
│       ├── components/        # 通用 React 组件
│       ├── hook/              # 自定义 hooks
│       └── i18n/              # next-intl request/navigation 配置
├── components.json            # shadcn 配置
├── tsconfig.json              # `@/*` → `./src/*`
└── package.json
```

## 核心架构

### 1. 数据请求 Fetcher（`src/common/lib/Fetcher.ts`）

统一 `fetch` 封装，提供静态 `get` / `post`：自动拼接 `API_BASIC_URL`、从 `CrosStorage` 取 token 写入 `Authorization` 头；响应按 `Result` 协议解析（`code !== "0"` 判错），失败时 `toast.error` 展示多语言文案（优先走 `translator(key)`），`user_not_login` 时触发 `redirectToLogin`。

### 2. 环境变量 Env（`src/common/lib/Env.ts`）

所有 `NEXT_PUBLIC_*` 环境变量在 `Env.ts` **集中读取并导出**（`API_BASIC_URL`、`TOKEN_KEY`、`TOKEN_STORAGE`、`STORAGE_PROXY`、`PASSPORT_ROOT`、`WWW_ROOT`、`ADMIN_ROOT`、`WEBSOCKET`、`CAPTCHA_URL`、`LOGIN_URL`、各类头像/上传 URL 等）。其余代码只 import `Env`，不直接读 `process.env`。`SESSION_CATEGORY_GROUP` / `SESSION_CATEGORY_NAME_MAPPING` 会做 `JSON.parse`。

### 3. 跨域存储 CrosStorage（`src/common/lib/CrosStorage.ts`）

跨站点（不同子域）共享登录态的核心：非跨域时直用 `localStorage/sessionStorage`；跨域时创建隐藏 iframe 指向 `STORAGE_PROXY`，通过 `postMessage` 收发 `StorageRequest/Response`（协议见 `protocol/CrosProtocol.ts`）完成 token 读写。`getToken` 支持 `generateVisitorToken` 兜底生成访客 token；`locateToken` 将 token 本地化解析出 `LoginUser`。

### 4. WebSocket 长连接（`src/common/lib/SparrowWebSocket.ts`）

带鉴权握手的 WebSocket 封装，支持：`PING/PONG` 心跳、超时重连、窗口焦点感知（`activeStatus` 判断是否在重连）、状态监控（`STATUS` 指令）、文本/二进制消息分发。鉴权成功后写 `sessionStorage[USER_INFO_KEY]` 并触发 `handshakeSuccess(LoginUser)`。

### 5. 协议类型（`src/common/lib/protocol/`）

- `Result` — 后端统一响应协议：`{ code, message?, data, key?, instruction? }`，`code === "0"` 表示成功；`PagerResult` 分页结构 `{ recordTotal, list, dictionary }`
- `CrosProtocol` — 跨域存储消息协议（`CommandType` / `StorageType` / `StorageRequest` / `StorageResponse`）
- `LoginUser` — 登录用户模型，含 `getCurrentUser` / `visitor` / `localize` / `parseLoginJSON` / `logout`
- `Status` / `Identity` / `KeyValue` / `ArrayBufferUtils` — 状态枚举、主键类型、键值对、二进制编解码工具

### 6. 后台管理状态（`src/common/lib/admin/`）

`AdminBroker` + `AccessHistoryContainer` + `AccessLog` + `AdminContextProvider` 构成轻量管理端状态中枢：记录访问历史（最多 20 条，用于面包屑/最近访问）、删除历史、通过 `newMessageSignal` 触发 React 重渲染（宿主项目在 `root-layout` 中用 `newReference()` 刷新 context 值）。

### 7. 通用表格系统（`src/common/components/table/`）

`DataTable`（`data-table.tsx`）基于 TanStack Table，采用**服务端分页 + 手动排序/筛选**，支持树形展开（`subRows`/`parentId`/`depth`）。分层拆分：

- `cell-render.tsx` + `cell/` — 单元格渲染：input/select/date/currency/tree/normal/operation/check-box/sortable/unix-timestamp 等
- `header/` — 表头：排序、列过滤、复选框、纯文本
- `pagination.tsx` / `pager.tsx` — 分页控件
- `column-operation.tsx` — 列操作（过滤/排序下拉）

属性与 meta 类型集中在 `lib/table/DataTableProperty.ts`（`DataTableProps` / `MyTableMeta` / `BasicData` 等），通用操作封装在 `lib/table/TableUtils.ts`（`getSelectedIds` / `removeRowByPrimary` / `batchEnable` / `batchDisable` 等）。

### 8. 表单组件（`src/common/components/forms/`）

`react-hook-form` 驱动的受控校验组件：`validatable-input` / `validatable-select` / `validatable-date` / `validatable-textarea`（通过 `forwardRef` 配合 RHF）；`search-input` / `search-select` 用于表格搜索条件（写入 `setSearchCondition`）。

### 9. 通用组件（`src/common/components/`）

- `Draggable.tsx` + `AsChild.tsx` — 基于 dnd-kit 的拖拽容器，`AsChild` 支持把 props 透传到子元素
- `DynamicRender.tsx` — 基于 SWR 的远程内容渲染，`isLoading` → `ThreeDotLoading`，`error` → `ErrorShower`
- `Error.tsx` / `LoadingSpinner.tsx` / `ThreeDotLoading.tsx` — motion 动画错误页 / 加载态
- `HtmlFragment.tsx` — 手动挂载到指定容器 DOM 的组件
- `access-histories.tsx` — 访问历史面包屑（配合 AdminBroker）

### 10. 文件上传（`src/common/components/file/`）

`FileUploader.tsx` 用 axios 以 `FormData` 上传（`pathType: "im"`），带进度回调；`FileUtils.ts` 根据扩展名生成文件类型图标 HTML。

### 11. 头部与国际化组件（`header/` + `i18n/`）

`header.tsx` / `user-profile.tsx` / `mode-toggle.tsx` / `theme-provider.tsx` 组成通用站点头部（logo、导航、用户菜单、深浅色切换、locale 切换）；`i18n/LocaleSwitcher.tsx` / `ErrorMessage.tsx` 提供语言切换与校验错误提示。

### 12. 自定义 hooks（`src/common/hook/`）

- `useReachBottom` — 滚动触底加载（带防抖与 `globalLoading` 去重）
- `useCrosStorage` — 获取 `CrosStorage` 实例并在卸载时 `destroy`
- `useCaptcha` — 验证码加载/刷新
- `useNavigating` — 统一重定向（`redirectToIndex` / `redirectTo` / `redirectToLogin`，登录重定向带 `ref` 回跳）

### 13. 国际化配置（`src/common/i18n/`）

- `navigation.ts` — 基于 `@/i18n/routing` 创建 `Link/useRouter/usePathname` 等导航原语
- `request.ts` — 单文件翻译加载（`messages/${locale}.json`）
- `multi-request.ts` — **多文件合并入口**：按 `messages/list.json` 索引动态合并各领域翻译文件（`default` 平铺 + 各领域命名空间）

## 开发约定与注意事项

- **路径别名**：`@/*` → `./src/*`。common 代码里 `@/i18n/routing`、`@/components/ui/*`、`@/lib/utils` 均依赖宿主项目，本地调试时需保证这些路径存在。
- **协议**：所有后端交互统一遵循 `Result` 协议，成功判定为 `code === "0"`；错误文案优先经 `Translator`（`(key: string) => string`，见 `lib/TranslatorType.ts`）多语言化。
- **环境变量**：新增环境变量一律在 `Env.ts` 集中声明导出，不要在业务代码直接读 `process.env`。
- **客户端组件**：涉及 `window` / `localStorage` / `document` 的模块（`CrosStorage`、`LoginUser` 等）需以 `"use client"` 或运行时判空保护，避免 SSR 报错。
- **tsconfig**：`strict` / `strictNullChecks` 均为 `false`，类型约束较宽松，允许 `any`。

## 静态部署约定

- 四站 Next.js 统一 `15.5.26`，生产使用 `output: "export"`、`trailingSlash: true`，产物统一 `out/`；开发缓存 `.next-dev`，生产缓存 `.next`。
- 生产阶段暂用 HTTP / WS，管理站规范域名为 `admin.sparrowzoo.com`，`coder` 仅为兼容别名。业务路由显式 `/zh/`、`/en/`，不依赖 middleware。
- 发布使用 npm 与 `package-lock.json`；根目录 `deploy/build-static.mjs` 完成安装、复制、构建和产物验证。`npm start` 仅预览静态产物，线上 Nginx 直接读文件。
- 操作手册：`common/public/backend/nginx/next15-http-launch.html`；可部署配置：`deploy/nginx/`。
