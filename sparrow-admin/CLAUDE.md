# 后台管理系统脚手架

> **为什么有 CLAUDE.md 和 AGENTS.md 两个配置文件？**
>
> Claude Code 原生同时识别 CLAUDE.md 和 AGENTS.md，两者都是项目级指令文件，格式相同。
> 本项目主配置在 **AGENTS.md**（含完整项目概述、脚手架版本、模型路由等）。
> 额外保留 CLAUDE.md 仅为满足 gstack 工具链的 preamble 检测——gstack 脚本只 grep
> CLAUDE.md 中的 `## Skill routing` 来判断路由是否已配置，不检查 AGENTS.md。
> CLAUDE.md 因此只放 routing 规则作为桩文件，项目信息以 AGENTS.md 为准。

## Skill routing

当用户请求匹配可用技能时，通过 Skill 工具调用。不确定时，优先调用技能。

关键路由规则：

- 产品想法/头脑风暴 → invoke /office-hours
- 战略/范围 → invoke /plan-ceo-review
- 架构 → invoke /plan-eng-review
- 设计评审 → invoke /design-consultation 或 /plan-design-review
- 完整评审流水线 → invoke /autoplan
- Bug/错误 → invoke /investigate
- QA/测试站点行为 → invoke /qa 或 /qa-only
- 代码审查/diff 检查 → invoke /review
- 视觉润色 → invoke /design-review
- 发布/部署/PR → invoke /ship 或 /land-and-deploy
- 保存进度 → invoke /context-save
- 恢复上下文 → invoke /context-restore
- 撰写待办 spec/issue → invoke /spec

