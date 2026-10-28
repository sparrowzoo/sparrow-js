# master 合并前修复与验证

- 日期：2026-10-28。
- 工作区：`/Users/zhanglizhi/workspace/sparrow/sparrow-js`。
- 工作分支：`feature_req-im-customer-service`，修复基线 `aa6e2cd`；目标 `master`，合并前 `d0fb80c`。
- 授权：用户要求合入 master，并在发现失败后明确批准先排查修复、再继续合并。

## 修复范围

- common 发布配置测试使用已改名的 sparrow 目录，并与现有 Authorization Cookie 配置对齐。
- 聊天协议测试传入现有 create121Chat 的协议类型参数，AI 枚举使用 AI_REQUEST；保留独立字节样本及边界断言。
- 登录测试使用 remember 字段及控件 ID，修正 use-auth-suffix 的模拟路径。
- Cookie 保存失败原先仅输出控制台错误；现在向用户显示已有的多语言系统错误提示，保持无成功提示、无跳转，不重复提示接口错误。
- 普通客服片段入口原先不传 ai，运行时按普通联系人处理；将 TalkProps.ai 声明为可选，保留现有行为并消除类型错误。

## 实际验证

- 修复前：common 104 通过、3 失败；chat 77 通过、5 失败；passport 33 通过、3 失败。
- 同步过时测试后：common 107/107、chat 82/82；passport 35/36，剩余失败确认 Cookie 保存失败时缺少用户错误提示。
- 补齐提示后：passport 36/36；以上合计 225 项通过。
- chat 与 passport：`yarn tsc --noEmit --incremental false` 均退出 0。chat 首次类型检查发现 TalkProps.ai 必填与普通片段调用不符，修复后复验通过。
- `git diff --check` 通过。此次未执行生产构建、跨服务业务验收或部署；既有上线前置条件仍见 operations.md。

## 评审结论

已自行检查上述改动及相关调用方；用户已授权修复与继续合并。本记录为修复提交前的验证，合并后结果由本次会话的实际复验报告说明。
