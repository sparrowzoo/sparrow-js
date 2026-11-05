# 实施与验证记录

## 实施范围

- 工作区：`/Users/zhanglizhi/workspace/sparrow/sparrow-js`
- 分支：`feature_req-menu-registration`；基线：`71ca8097`。
- 保留开始前 common/package.json 中的复制脚本修改，并按已确认范围接入统一脚本。
- 注册器、Sparrow 单一菜单源、客户端页头入口、调用迁移及统一复制均已实施；没有提交或发布。

## 验证结果

| 检查 | 结果 |
| --- | --- |
| `yarn --cwd common vitest run --config vitest.menu.config.mjs` | 2 个测试文件、7 项测试通过 |
| `yarn --cwd common build` | 通过，32.90 秒 |
| `yarn --cwd sparrow-chat build` | 通过，23.61 秒 |
| `yarn --cwd sparrow-passport build` | 通过，21.63 秒 |
| 统一脚本临时目录真实复制 | 默认四站、外部显式选择、模块隔离、任意 cwd、隐藏文件、重复覆盖、保留额外文件、预检失败无写入、dry-run 均通过 |
| `node deploy/copy-shared.mjs sparrow-admin sparrow-coder sparrow-chat sparrow-passport ling-admin ling-www` | 六站同步完成 |
| 源文件与下游逐文件内容对比 | 各站 100 个通用文件一致；chat/passport 额外 2 个 Sparrow 文件一致 |
| 复制范围 | admin/coder/凌卓不存在 src/sparrow；六站均无 src/src/common |
| 静态 HTML 导航 | 主站、chat、passport 中英文共 6 页均有菜单，无 /lang/ 残留；主站为产品介绍入口，chat/passport 为真实应用入口 |
| `git diff --check` | 通过 |

构建日志位于本机 `/tmp/sparrow-menu-{common,chat,passport}-build.log`，属于临时日志。
菜单测试覆盖任意业务编号、顺序、显示属性、入口选择、缺失过滤、翻译、语言隔离、重复注册、空菜单、重复编号失败保持旧状态、输入与输出防修改，以及共享 Header 不读取 product。

## 复核与限制

独立只读复核确认客户端包装避免实例和函数跨服务端边界，注册器不存储请求语言，实际调用迁移完整。发现旧 README 示例不适用，已重写并再次同步。
保留 Header 的原有品牌、登录、语言与主题行为；本轮没有重设计这些能力。
未运行浏览器交互验收，未构建 admin/coder 或凌卓项目。其业务页头未改；本轮已检查通用代码同步结果。

## 评审结论

已在用户批准范围内完成实施、自查和上述验证；无已知待修复问题。独立业务验收、提交、推送、发布尚未执行。

## 后续：common 一键分发

用户进一步授权将脚本集中到 common，并保证一键分发到所有指定站点。

- 唯一脚本移至 `common/copy-shared.mjs`，`yarn --cwd common copy` 默认分发全部六站。
- 子站点 package.json 删除 copy 命令，构建脚本在构建前从 common 一次同步所需站点。
- 原文章页头复制保留为 `copy:article-header`，凌卓单站快捷入口仍在 common。用户已删除的 deploy/copy-2-app.sh 不恢复。
- 全部源和目标先检查，再写入；复制完成逐文件对比内容，失败以非零退出，不把缺失站点当作成功跳过。
- `node --test common/tests/copy/copy-shared.test.mjs`：3 项通过，覆盖六站完整分发、业务隔离、任意工作目录、隐藏文件、重复覆盖、应用文件保留、dry-run、单站选择、缺失/未知目标无写入。
- `bash -n deploy/build-static.sh`：通过。本轮未执行构建打包或发布。
- 实际执行 `yarn --cwd common copy` 成功：6 个站点、8 个目录、604 个文件全部核对一致；`git diff --check` 通过。

## 提交前范围更新

保留用户对分发列表的调整：admin/coder 也接收 src/sparrow，四个 Sparrow 子站点统一分发两个目录；凌卓仍仅接收 common。同步测试、当前说明和 admin/coder 副本忽略规则；以上历史验证记录按当时范围保留。
