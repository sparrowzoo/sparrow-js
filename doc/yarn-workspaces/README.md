# Yarn 统一安装与依赖瘦身

## 范围和方案

本次只接入 `common`、`sparrow-admin`、`sparrow-coder`，沿用 Yarn 1.22.19 和 Node.js 22+。各项目保留自己的依赖声明、启动命令及静态导出目录。根目录统一维护安装入口和 yarn.lock；相同版本提升到根 node_modules，必要的不同版本留在子目录。

其他六个已安装项目不接入，仍使用原来的安装方式和锁文件。不升级 React、Next.js、Tailwind 的主版本，不调整业务代码，不发布或部署。

（第二轮扩展，2026-10-21：经用户确认接入 `sparrow-chat`、`sparrow-passport` 并将两项目升级到 React 19、valibot 统一到 1.1，详见下文「第二轮瘦身记录」。）

三个原锁文件合并时，同一依赖选择条件有冲突的记录优先采用 common，其次 sparrow-admin，再次 sparrow-coder；之后由 Yarn 规范化。保留已有解析记录，最终记录直接依赖的实际版本变化。

## 实施与验证计划

1. 保存现有改动并推送 master，创建 chore/yarn-workspaces 分支。
2. 新建根 package.json 和统一锁文件，移除三个子项目锁文件。
3. 备份原 node_modules 后在根目录安装，验证三个项目的依赖解析和生产构建、common 现有认证单测。
4. 构建脚本改用 Yarn，保留原静态产物路径。验证 frozen-lockfile 可重复安装。
5. 检查未接入项目的依赖解析是否变化，记录磁盘占用和限制，清理本次临时依赖备份。

## 环境与恢复

安装只涉及当前仓库的依赖目录及 Yarn 缓存；不修改全局工具配置、不使用真实业务数据、不部署。必要下载沿用各锁文件中的软件源。原依赖暂存到本机临时目录，成功验证后清理。回退时恢复 Git 中的原依赖清单和锁文件，删除本次生成的依赖目录，再分别执行 yarn install --frozen-lockfile。不要只切换 Git 分支却继续使用另一种目录布局下的依赖。

## 授权和检查记录

用户在收到三项目试点建议后明确要求“先commit & push 然后切新分支干吧 干完给我总结一下说明文档”，本次按该范围执行。现有业务改动已提交为 d0fb80c 并推送 origin/master；依赖改造在新分支进行。

### 检查结果（2026-10-21）

- 根安装：`yarn install` 成功；`yarn install --frozen-lockfile` 复验通过（Already up-to-date，锁文件无再变动），可重复安装成立。
- 磁盘占用：改造前三项目依赖共约 2.0GB（common 751M、admin 646M、coder 646M）；改造后合计 817M（根 764M + common 48M + admin 2.6M + coder 2.6M），节省约 60%。
- 未接入项目：对 6 个未接入项目的 328 项直接依赖逐一 `require.resolve` 对比改造前基线，解析路径零变化，原本解析失败的依赖错误码也一致，无根目录提升泄漏。
- common 认证单测：4 failed / 90 passed，4 个失败均为存量问题、与依赖改造无关——release-config.test.ts 的 3 个失败因测试仍读取已改名目录 react-next-admin/im/passport 的 .env（ENOENT）；consumers.test.ts 的 1 个失败是测试期望 reject 结果对象而 Fetcher 实际 reject `new Error(message)`（代码与测试契约不一致，提交于改造之前）。按「不调整业务代码」范围仅记录不修复。
- 生产构建：三项目 `next build` 全部通过并生成静态导出（common/out 11M 52 页、sparrow-admin/out 4.5M、sparrow-coder/out 2.1M）。期间排除两类与依赖改造无关的环境残留：历史 sudo 构建留下的 root 属主 `.next/`、`out/` 目录（EACCES，已提权清理）。
- 构建中发现并修复的两处问题：
  1. 锁文件合并保留了同一依赖的两个 range 记录（`@types/react@^19`→19.1.4 与 `@types/react@^19.0.0`→19.3.0，react-dom 同理），导致 admin/coder 本地残留第二副本、类型身份冲突编译失败。已按「common 优先」策略手工合并锁记录统一到 19.1.4/19.1.5，重装后本地副本与孤立 csstype 3.2.3 自动消除，admin/coder 依赖完全提升到根。
  2. coder 的 project-config 页面因 common 8b825ae（2026-10-09）引入 `RowOperation` 包装对象契约后未跟进而类型报错（存量问题，master 上同样失败）。经用户确认顺手修复，改为与 admin 一致的 `{component: X}` 写法。
- 限制：根 node_modules 提升要求各项目同版本依赖；新增依赖须在仓库根目录执行 yarn 安装，三个接入项目不再维护独立锁文件；锁文件合并时同一依赖的不同 range 字符串各自保留解析记录，后续如出现类型包双副本需手工合并锁记录统一版本。
- 临时备份：原依赖备份已清理；残留 646M root 属主文件位于系统临时目录（/var/folders/.../T/sparrow-workspaces-backup-hw19gw1l），不影响仓库，可由系统自动清理或手动 sudo 删除。

## 第二轮瘦身记录（2026-10-21）

用户确认扩展三项动作：消除 common 本地冲突副本、清理 4 个老项目依赖、接入 sparrow-chat 与 sparrow-passport。

### 动作与结果

1. **消除 common 本地 49M 冲突副本**：合并锁记录统一 react-day-picker→9.14.0、react-hook-form→7.88.0、@radix-ui/react-dropdown-menu→2.1.24（范围互容，common 优先）；lucide-react 因 0.x caret 只锁补丁位（^0.511.0 与 ^0.513.0 不互容），将 admin/coder 声明对齐到 ^0.513.0。注意：增量安装会残留陈旧嵌套副本（如 react-menu 下的旧 dismissable-layer），需删除全部 node_modules 干净重装。三项目构建复验通过。
2. **清理老项目依赖**：删除 react-next-14、react-next-shadcn、react-webpack、sparrow 的 node_modules（共 1.3GB）；各自锁文件保留在 Git 中，需要时在对应目录 yarn/npm install 恢复。
3. **接入 chat/passport（含 React 19 升级）**：
   - 锁合并脚本注意 `npm:` 别名 selector（如 `string-width-cjs@npm:string-width@^4.2.0`）含冒号必须加引号。
   - 两项目原为 React 18，与三个 React 19 项目混居会产生结构性类型冲突（TypeScript 自动包含所有祖先目录的 @types，Next 共享包的 LayoutProps 双重类型身份无法靠提升偏置根治，root devDependencies 偏置只会让跷跷板翻向另一侧）。经用户确认升级两项目 react/react-dom/@types 至 19。
   - React 19 伴生修复两处：passport captcha-image 的 `RefObject<HTMLImageElement>` → `RefObject<HTMLImageElement | null>`（useRef 返回类型变更）；avatar-editor 的全局 `JSX.IntrinsicElements` → `React.JSX.IntrinsicElements`（全局 JSX 命名空间移除）。
   - valibot 同理为 major 分裂（admin/coder 1.1 vs chat/passport 0.33，@hookform/resolvers 提升后类型绑定根版本）。经用户确认统一到 1.1：chat 的 valibot 为零使用的死依赖、直接删除声明；passport 代码已是 v.pipe 现代写法，14 个所用 API 在 1.1 全部原样存在，仅改版本声明、零代码迁移。
   - deploy/build-static.sh 改为单一根目录安装入口。

### 验收（全绿）

五项目 `next build` + 静态导出全部通过（common 14M / admin 4.6M / coder 2.2M / chat 18M / passport 16M）；passport test:auth 通过；common test:auth 维持既有 4 个存量失败（90 通过，与本轮无关）；`yarn install --frozen-lockfile` 可重复安装通过。

### 磁盘收益

| 阶段 | 依赖总占用 |
|---|---|
| 本轮开始（三项目 workspaces + 其余独立） | ≈3.66GB |
| 本轮结束（五项目 workspaces + 老项目清理） | ≈1.34GB（根 1.2G + chat 108M + passport 24M + 其余 <3M） |

净省约 2.3GB。chat/passport 剩余本地副本为真实版本差异（tiptap/emotion/eslint 8 等），属「必要的不同版本留在子目录」。

### 运行时版本变更摘要（需发布回归关注）

- sparrow-chat、sparrow-passport：react/react-dom 18.3.1→19.1.0，@types/react(-dom) 18→19；passport valibot 0.33.3→1.1.0；chat 移除未使用的 valibot 声明。
- sparrow-admin、sparrow-coder：react-hook-form 7.57.0→7.88.0、@radix-ui/react-dropdown-menu 2.1.15→2.1.24、lucide-react 0.511.0→0.513.0、react-day-picker 9.9.0→9.14.0。
