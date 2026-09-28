<!-- ai-coding-workflow:generated schema=1 -->
<!-- sources-sha256: 5ef628b4c72d20b33ade353eaf1d826e291fa362520fd03eb646630f4d3efcdb -->
# req-r01-sso-token-storage 执行计划

本轮：01

本文件由 DSL 生成，请修改源文件后重新 render。状态与证据是声明；业务语义、测试真实性及审查质量由人或审查流程确认。CLI 不执行以下命令。

来源：[技术](technical.md) · [场景](technical.md#acceptance) · [任务 DSL](plan.yaml)

Git 追溯：提交正文使用 `Task: <feature>/<TID>`；任务编号在 feature 内终身不复用，历史复用由 Git 审查检查。当前提交无需将自己的 hash 写回当前文件。

## T01 实现统一存储策略 CRUD 与 Cookie 保存

- 状态：done
- 依赖：无
- 需求：[R01](technical.md#R01)
- 场景：[S01](technical.md#acceptance) 三种存储保持原 token；[S02](technical.md#acceptance) 持久 Cookie 只按明确保存时点计算；[S03](technical.md#acceptance) Cookie 失败不伪装为空或成功
- 设计：[technical.md#api-01](technical.md#api-01)；[technical.md#test-strategy](technical.md#test-strategy)

修改文件：

- common/src/common/lib/Env.ts
- common/src/common/lib/storage/CookieStorage.ts
- common/src/common/lib/storage/StorageManager.ts
- common/src/common/lib/storage/WebStorage.ts
- common/src/common/lib/storage/types.ts
- common/src/common/lib/protocol/CrosProtocol.ts
- common/package.json
- common/yarn.lock
- common/vitest.auth.config.mjs
- common/tests/auth/cookie.test.ts

验证命令（项目根执行）：

```text
yarn --cwd common test:auth tests/auth/cookie.test.ts
```

验证与审查证据：

- RED：真实注册策略存取返回 null；Cookie 无等号前缀项误命中，jsdom 35 通过/1 失败；见 evidence.md#implementation。
- GREEN：yarn --cwd common test:auth tests/auth/cookie.test.ts：36/36 通过；见 evidence.md#implementation。
- REVIEW：独立审查：14+1、会话、编码、原 token、范围和失败语义已核对；误命中修复后回归通过。见 evidence.md#review。
- 备注：策略与 Cookie 36 项通过；无等号 Cookie 误命中已回归修复。

Git trailer：

```text
Task: req-r01-sso-token-storage/T01
```

## T02 抽离 RPC 和监控并复用统一存储策略

- 状态：done
- 依赖：T01
- 需求：[R02](technical.md#R02)
- 场景：[S04](technical.md#acceptance) RPC 在认证站保存 Cookie；[S05](technical.md#acceptance) RPC 失败与消息来源可区分
- 设计：[technical.md#api-02](technical.md#api-02)；[technical.md#test-strategy](technical.md#test-strategy)

修改文件：

- common/src/common/lib/CrosStorage.ts
- common/src/common/lib/protocol/CrosProtocol.ts
- react-next-passport/src/app/(cros)/cros-storage/page.tsx
- react-next-passport/src/app/(cros)/cros-storage-debug/page.tsx
- react-next-passport/src/common/lib/storage/CookieStorage.ts
- react-next-passport/src/common/lib/storage/StorageManager.ts
- react-next-passport/src/common/lib/storage/WebStorage.ts
- react-next-passport/src/common/lib/storage/types.ts
- react-next-passport/src/common/lib/rpc/PostMessageRpc.ts
- react-next-passport/src/common/lib/rpc/StorageProxy.ts
- react-next-passport/src/common/lib/monitor/StorageMonitor.ts
- react-next-passport/src/common/lib/CrosStorage.ts
- react-next-passport/src/common/lib/Env.ts
- react-next-passport/src/common/lib/protocol/CrosProtocol.ts
- common/src/common/lib/rpc/StorageProxy.ts
- common/src/app/\[locale\]/cros/page.tsx
- common/src/common/lib/rpc/PostMessageRpc.ts
- common/src/common/lib/monitor/StorageMonitor.ts
- common/tests/auth/rpc.test.ts
- common/tests/auth/monitor.test.ts
- common/tests/auth/diagnostic.test.tsx
- react-next-passport/package.json
- react-next-passport/yarn.lock
- react-next-passport/vitest.auth.config.mjs
- react-next-passport/tests/auth/proxy.test.tsx

验证命令（项目根执行）：

```text
set -e
yarn --cwd react-next-passport copy
yarn --cwd common test:auth tests/auth/rpc.test.ts tests/auth/monitor.test.ts tests/auth/diagnostic.test.tsx
yarn --cwd react-next-passport test:auth tests/auth/proxy.test.tsx
```

验证与审查证据：

- RED：旧实现提前建 iframe、错 source INIT、泄露值；空闲监听新增 6 项失败后修复。见 evidence.md#implementation、#review。
- GREEN：RPC 23、monitor 5、diagnostic 2、Passport proxy 33 项全部通过；最终完整测试报告 validation/unit-2026-09-28.json。
- REVIEW：交叉独立审查通过；成功/错误/超时/销毁/同步重入空闲解绑已复核，保持消费者 API。见 evidence.md#review。
- 备注：RPC/监控/代理已分离；监听泄漏修复；客户端 30 项、代理 33 项通过。

Git trailer：

```text
Task: req-r01-sso-token-storage/T02
```

## T03 实现本地优先读取且保持现有消费者和访客行为

- 状态：done
- 依赖：T02
- 需求：[R03](technical.md#R03)
- 场景：[S06](technical.md#acceptance) 本地仍有值就直接返回；[S07](technical.md#acceptance) 本地为空后仅使用本次 RPC 结果；[S08](technical.md#acceptance) 两处缺失后保留受保护和匿名入口区别
- 设计：[technical.md#api-03](technical.md#api-03)；[technical.md#test-strategy](technical.md#test-strategy)

修改文件：

- common/src/common/lib/CrosStorage.ts
- common/tests/auth/read.test.ts
- common/tests/auth/consumers.test.ts

验证命令（项目根执行）：

```text
yarn --cwd common test:auth tests/auth/read.test.ts tests/auth/consumers.test.ts
```

验证与审查证据：

- RED：真实旧实现本地有值仍返回 remote；远端空字符串应 null 的回归先失败。见 evidence.md#implementation。
- GREEN：读取 9 项、真实消费者 5 项通过；三策略不回写由最终 Chrome 回归覆盖。见 validation/unit-2026-09-28.json、validation/browser-2026-09-28.json。
- REVIEW：独立审查确认不解析业务期限、不续期、不重建 token；空值归一化仅作用 getToken。见 evidence.md#review。
- 备注：本地优先、无回写/缓存、原 token 与消费者协议已验证。

Git trailer：

```text
Task: req-r01-sso-token-storage/T03
```

## T04 接入记住我保存选项与前端登录退出清理

- 状态：done
- 依赖：T03
- 需求：[R04](technical.md#R04)
- 场景：[S09](technical.md#acceptance) 登录选择决定 Cookie 保存形式；[S10](technical.md#acceptance) 新登录不会被独立旧值遮蔽；[S11](technical.md#acceptance) 退出清除当前可读来源和资料
- 设计：[technical.md#api-04](technical.md#api-04)；[technical.md#test-strategy](technical.md#test-strategy)

修改文件：

- common/src/common/lib/CrosStorage.ts
- common/src/common/lib/protocol/LoginUser.ts
- common/src/common/hook/CrosStorageHook.tsx
- common/src/common/components/header/user-profile.tsx
- react-next-passport/src/app/(passport)/\[locale\]/sign-in/page.tsx
- react-next-passport/src/common/lib/CrosStorage.ts
- react-next-passport/src/common/lib/protocol/LoginUser.ts
- react-next-passport/src/common/hook/CrosStorageHook.tsx
- react-next-passport/src/common/components/header/user-profile.tsx
- common/tests/auth/login-state.test.ts
- common/tests/auth/header.test.tsx
- react-next-passport/tests/auth/login.test.tsx

验证命令（项目根执行）：

```text
set -e
yarn --cwd react-next-passport copy
yarn --cwd common test:auth tests/auth/login-state.test.ts tests/auth/header.test.tsx
yarn --cwd react-next-passport test:auth tests/auth/login.test.tsx
```

验证与审查证据：

- RED：旧 logout 无 Promise；Header 将读取错误/解析空值显示访客的真实组件断言先失败。见 evidence.md#implementation、#review。
- GREEN：登录页 3、登录状态 6、Header 5 项通过；见 validation/unit-2026-09-28.json。
- REVIEW：独立审查后补齐失败重试与缓存边界；共享 Cookie 歧义不误报身份切换成功。见 evidence.md#review。
- 备注：记住我、清理顺序、hook 生命周期及 Header 错误/访客区分已验证。

Git trailer：

```text
Task: req-r01-sso-token-storage/T04
```

## T05 对齐四站配置、同步共享源并准备升级重登交接

- 状态：done
- 依赖：T04
- 需求：[R05](technical.md#R05)
- 场景：[S12](technical.md#acceptance) 同步发布后新页面要求重新登录
- 设计：[technical.md#api-05](technical.md#api-05)；[technical.md#test-strategy](technical.md#test-strategy)

修改文件：

- common/.env.development
- common/.env.production
- react-next-admin/.env.development
- react-next-admin/.env.production
- react-next-im/.env.development
- react-next-im/.env.production
- react-next-passport/.env.development
- react-next-passport/.env.production
- common/tests/auth/release-config.test.ts
- react-next-admin/src/common/lib/CrosStorage.ts
- react-next-admin/src/common/lib/storage/CookieStorage.ts
- react-next-admin/src/common/lib/storage/StorageManager.ts
- react-next-admin/src/common/lib/storage/WebStorage.ts
- react-next-admin/src/common/lib/storage/types.ts
- react-next-admin/src/common/lib/rpc/PostMessageRpc.ts
- react-next-admin/src/common/lib/rpc/StorageProxy.ts
- react-next-admin/src/common/lib/monitor/StorageMonitor.ts
- react-next-admin/src/common/lib/Env.ts
- react-next-admin/src/common/lib/protocol/CrosProtocol.ts
- react-next-admin/src/common/lib/protocol/LoginUser.ts
- react-next-admin/src/common/hook/CrosStorageHook.tsx
- react-next-admin/src/common/components/header/user-profile.tsx
- react-next-im/src/common/lib/CrosStorage.ts
- react-next-im/src/common/lib/storage/CookieStorage.ts
- react-next-im/src/common/lib/storage/StorageManager.ts
- react-next-im/src/common/lib/storage/WebStorage.ts
- react-next-im/src/common/lib/storage/types.ts
- react-next-im/src/common/lib/rpc/PostMessageRpc.ts
- react-next-im/src/common/lib/rpc/StorageProxy.ts
- react-next-im/src/common/lib/monitor/StorageMonitor.ts
- react-next-im/src/common/lib/Env.ts
- react-next-im/src/common/lib/protocol/CrosProtocol.ts
- react-next-im/src/common/lib/protocol/LoginUser.ts
- react-next-im/src/common/hook/CrosStorageHook.tsx
- react-next-im/src/common/components/header/user-profile.tsx
- react-next-passport/src/common/lib/CrosStorage.ts
- react-next-passport/src/common/lib/storage/CookieStorage.ts
- react-next-passport/src/common/lib/storage/StorageManager.ts
- react-next-passport/src/common/lib/storage/WebStorage.ts
- react-next-passport/src/common/lib/storage/types.ts
- react-next-passport/src/common/lib/rpc/PostMessageRpc.ts
- react-next-passport/src/common/lib/rpc/StorageProxy.ts
- react-next-passport/src/common/lib/monitor/StorageMonitor.ts
- react-next-passport/src/common/lib/Env.ts
- react-next-passport/src/common/lib/protocol/CrosProtocol.ts
- react-next-passport/src/common/lib/protocol/LoginUser.ts
- react-next-passport/src/common/hook/CrosStorageHook.tsx
- react-next-passport/src/common/components/header/user-profile.tsx

验证命令（项目根执行）：

```text
set -e
yarn --cwd common test:auth tests/auth/release-config.test.ts
yarn --cwd react-next-admin copy
yarn --cwd react-next-im copy
yarn --cwd react-next-passport copy
yarn --cwd common build
yarn --cwd react-next-admin build
yarn --cwd react-next-im build
yarn --cwd react-next-passport build
```

验证与审查证据：

- RED：配置用例最初 3 项失败；新增生产关闭 debug 断言再次失败后修正。见 evidence.md#implementation。
- GREEN：配置 3 项通过；三站 copy 后 86 文件逐字节相同；四站 compile/lint/types/static export 均退出 0。原目录权限受限改用源码一致的临时副本。见 validation/build-2026-09-28.json。
- REVIEW：独立审查确认生产共享 Cookie、新 key、关闭 debug；构建输入逐字节与当前源码核对一致。见 evidence.md#builds。
- 备注：四站配置及 86 份共享源一致；四站临时源码副本生产构建通过，未部署。

Git trailer：

```text
Task: req-r01-sso-token-storage/T05
```

## T06 验证同根域 SSO 并记录跨根域实际边界

- 状态：blocked
- 依赖：T05
- 需求：[R06](technical.md#R06)
- 场景：[S13](technical.md#acceptance) 同根域子域通过真机验收；[S14](technical.md#acceptance) 跨根域限制如实记录
- 设计：[technical.md#api-06](technical.md#api-06)；[technical.md#test-strategy](technical.md#test-strategy)

修改文件：

- common/package.json
- common/yarn.lock
- common/playwright.auth.config.ts
- common/tests/auth/e2e/sso.spec.ts
- common/tests/auth/e2e/fixture-server.mjs
- doc/req-r01-sso-token-storage/evidence.md

验证命令（项目根执行）：

```text
yarn --cwd common test:auth:e2e tests/auth/e2e/sso.spec.ts
```

验证与审查证据：

- RED：未记录
- GREEN：最终 Chrome 9/9：7 行为+2 跨根观察；Lax 空值、None 可读，均不回写。仅桌面通过，不等于 S13 真机通过。见 validation/browser-2026-09-28.json。
- REVIEW：已核对真实生产模块、双代理、HTTPS 三域与浏览器参数；同根域真机及线上故障环境未执行，T06 保持 blocked。见 evidence.md#browser。
- 备注：桌面 Chrome 9/9 通过；缺 iOS Safari/Android Chrome 真机接入，待真机验收。

Git trailer：

```text
Task: req-r01-sso-token-storage/T06
```
