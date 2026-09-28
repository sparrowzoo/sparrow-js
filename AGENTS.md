# 依赖安装

- 依赖安装统一使用 Yarn，不使用 npm install；项目已有 Yarn 配置和锁文件时沿用。

# 主站文章约定

- 面向主站发布的文章保存到 `common/public/`，按内容归入对应子目录，并以 HTML 作为交付格式。
- 先检查现有分类；没有合适分类时，先告知用户分类缺失及拟采用的目录，不要无提示地新建分类或把文档放到其他位置。
- 编写或改写文章前，必须先读取 `common/ai/文章编写提示词.md`，遵循其中的文章结构和视觉要求。
- HTML 与主站主题保持一致，保留 Banner 导航；参考现有文章和主站样式，保证移动端表格、代码块可阅读。
- 不再将 `common/docs/` 或其他目录中的 Markdown 作为文章最终交付。发布到主站文档目录时，同步维护目录入口及所需的中英文标题、简介。

# 共享 Skills 仓库与维护

- 我们自行开发、维护的 skills、agents、模板和脚本，其唯一源是 `/Users/zhanglizhi/workspace/sparrow/AICoding/.agents`，在 AICoding 仓库持续维护。
- AI Coding 工作流的规范、DSL 说明和设计文档统一写回 `/Users/zhanglizhi/workspace/sparrow/AICoding/design-docs/`；当前项目不维护这类文档副本。业务功能文档的位置按该功能的明确约定执行。
- 第三方 skills 与工具（如 OpenSpec、Superpowers）安装在用户家目录或官方插件目录，由其安装／更新机制管理；不要复制进 AICoding，也不要纳入我们的源码维护。
- 当前项目的 `.agents` 和 `.claude` 都是直接指向该唯一源的目录软链接；不再逐个 skill 建立链接，也不在项目内维护副本。
- `write-doc`、`grill-me` 已一并归入唯一源的 `skills/` 目录，后续修改也回源进行。
- 更新共享内容时，先检查 AICoding 仓库的适用约定；版本提交与 GitHub 同步在 AICoding 仓库进行。新增 skill 或配套文件直接放入唯一源即可，无需在当前项目补建单独链接。
- 唯一源移动或换电脑后，重新核对两个目录链接的目标。共享 skill 执行任务时仍须遵循当前项目的输出目录、文章模板和发布约定。
- OpenSpec CLI 统一安装于 `~/.npm-global`，通过 `~/.local/bin/openspec` 调用；更新时使用 `npm install -g --prefix "$HOME/.npm-global" --cache "$HOME/.cache/npm-openspec" @fission-ai/openspec@latest`。
- OpenSpec 官方 skills 安装在 `~/.agents/skills/openspec-*`，`~/.claude/skills/openspec-*` 通过软链接复用；Claude 命令安装在 `~/.claude/commands/opsx/`。Codex 使用 `$openspec-continue-change` 等 skill 名，Claude 使用 `/opsx:continue` 等命令；全局 custom 工作流包含 continue 在内的完整工作流集。
- 刷新 OpenSpec 官方 skills／命令时，目标仍为上述用户级目录；不要在 AICoding 或本项目中生成第三方副本。CLI 升级与生成文件刷新是两个步骤。
