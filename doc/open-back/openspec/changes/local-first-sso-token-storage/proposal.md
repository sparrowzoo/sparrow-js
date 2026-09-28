# Proposal

## Why

现有 SSO 把跨源 token 读取委托给认证站 iframe；线上手机端出现取不到登录态的问题。需要在保留 LOCAL、SESSION 的基础上增加 COOKIE，并通过本地优先读取减少跨子域场景对 iframe 存储访问的依赖。当前尚未通过真机复现确认所有线上故障根因。

## What Changes

- `getToken()` 先读取当前应用站配置的存储，确认无 token 后再向认证站 A 发起 `postMessage` RPC；RPC 返回值只供本次调用使用，不在应用站 B 持久化或长期缓存。
- 增加 COOKIE 模式与明确的 Domain、Path、SameSite、Secure 配置；同浏览器、同站点 HTTPS 跨子域 SSO 是必须通过的验收项。
- 记住我勾选时使用配置业务天数，未配置默认 14 天；Cookie 保留至业务到期后 1 天。未勾选使用会话 Cookie。业务到期后不得使用或续期，必须重新登录；有效期内的续期结果只更新原认证来源。
- 后端统一保证鉴权、会话失效和注销一致性是用户已确认的既有能力。本变更对接并验证，不新增后端注销系统。
- **BREAKING**：升级切换凭证命名空间，要求重新登录；不导入旧 token，不以读操作延长有效期。
- 增加 RPC 能力协商、失败分类、退出及迟到响应处理、访客隔离、脱敏监控和发布回滚检查。
- 不支持不同浏览器之间共享登录；不同根域仍可尝试 RPC，但不保证受第三方 Cookie 限制的浏览器能静默 SSO；不引入 OAuth、BFF 或 HttpOnly 改造。

## Capabilities

### New Capabilities

- `sso-token-storage`: 三种存储模式、本地优先且 RPC 不回写、Cookie 属性及 RPC 契约。
- `sso-session-lifecycle`: 记住我、业务期限、续期来源、退出一致性、访客与并发状态。
- `sso-release-validation`: 重新登录迁移、四站配置一致性、灰度回滚与移动端验收。

### Modified Capabilities

无；本项目尚无已有 OpenSpec capability。

## Impact

- 共享权威源码：`common/src/common/`，尤其 `CrosStorage`、`CrosProtocol`、`Env`、`LoginUser`、`Fetcher`、上传及 WebSocket 消费者。
- 认证站：`react-next-passport` 的登录表单/API、正常及 debug 存储代理；其他站通过现有 copy 流程同步共享代码。
- 四站 `.env.development`、`.env.production` 及 `deploy/build-static.sh`、`deploy/deploy.sh` 的兼容性检查。
- 后端依赖：已有会话有效性保证；登录/续期需提供可映射的已签名业务到期、有效记住我策略及新 token。具体 HTTP 接入通过适配器和联调契约落实，不能把本地相邻仓库当作线上部署事实。
- 接口评审前置项：design 中 `sessionId/issuedAt/renewAfter` 是用于身份关联与续期调度的**拟定规范化契约**，尚无线上字段映射证据，不能解释为用户已确认后端支持这些同名字段。需要先用现有接口资料确定可否映射；若必须扩展 token 格式，单独列明后端契约影响，经接口评审收敛后才能激活版本 2，不借此新增注销机制。
- 本次交付为工程设计、规格、实施计划，不实施业务代码、不发布站点。
