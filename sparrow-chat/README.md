Sparrow IM

# 初始化化shadcn

```
npx shadcn@latest init
```

# 升级Tailwind CSS到最新版本

```
npx @tailwindcss/upgrade
```
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## AI 消息与问题卡片

聊天页通过 `MessageContent` 按公共 `MessageType` 渲染 TEXT(0)、安全 HTML(1)、Markdown(2)、兼容 AI(3)、QUESTION(4) 与 ANSWER(5)。普通 AI 请求使用 `AI_REQUEST + AI(3)` 和原始文字；问题选项提交使用 `AI_REQUEST + ANSWER(5)`，载荷为 `{questionId, content}`，不增加历史会话协议。卡片支持单选、多选和自填答案；等待回复时禁止重复提交，ERROR 或发送失败会解除等待。

`@/common/*` 与协议测试直接引用 `../common/src/common`；Next i18n 使用宿主的 `src/i18n/request.ts` 加载本应用语言文件；旧 `src/common` 复制目录不再作为构建输入。认证继续使用现有 `CrosStorage.getCurrentUser()`，连接与二进制业务协议复用公共实现，没有新增演示登录接口。心跳由服务端 Netty 发送原生 WebSocket PING，浏览器自动回复 PONG；前端移除自定义心跳码及心跳定时器，保留断线重连。连接图标随连接状态事件更新，联系人状态仅在鉴权成功后查询一次。

验证：`yarn workspace sparrow-chat test:protocol`、`yarn workspace sparrow-chat typecheck`、`yarn workspace sparrow-chat build`。协议测试覆盖消息类型、QUESTION→ANSWER、错误恢复和重复提交；组件测试覆盖纯文本、Markdown、安全 HTML 与问题卡片。真实模型和浏览器联调需启动对应后端后另行验证。
