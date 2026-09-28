# Local-first SSO Token Storage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 保留 LOCAL/SESSION，新增 COOKIE，完成本地优先、RPC 不缓存 B、权威来源续期与四站分阶段升级。

**Architecture:** 共享配置、claims 与存储适配器提供底层能力；独立 RPC transport 和 TokenLifecycle 协调来源、并发及身份失效。登录、HTTP、上传和 WS 消费同一生命周期，SessionGateway 直接使用 fetch 对接经过夹具验证的既有后端，不依赖 Fetcher。

**Tech Stack:** TypeScript、现有 Next.js 15.5.26 静态导出、各宿主既有 React 版本；计划新增 Vitest、jsdom、Testing Library、Playwright 与测试专用 Vite 服务。使用 Node.js 22+、npm 和 package-lock.json。

**Spec:** `doc/openspec/changes/local-first-sso-token-storage/design.md`（[设计](../../openspec/changes/local-first-sso-token-storage/design.md)、[提案](../../openspec/changes/local-first-sso-token-storage/proposal.md)）。所有文件路径和代码命令均相对目标项目根目录 `/Users/zhanglizhi/workspace/sparrow/sparrow-js`。

## Global Constraints

- 本文件是实施计划；编写计划时不安装依赖、不实施业务代码、不发布、不调用真实登录接口。以下命令均留给获准后的实施阶段。
- 共享代码只改 `common/src/common`，下游通过 `npm run copy` 同步；不可直接编辑下游 `src/common` 副本。
- 保留 LOCAL、SESSION，新增可配置 COOKIE；无配置默认 LOCAL。`NEXT_PUBLIC_SSO_CREDENTIAL_VERSION=1` 为兼容发布默认；版本 2 启用新流程及 `${TOKEN_KEY}:v2`，COOKIE 必须为 2。
- RPC token 不写 B 的任何持久存储，也不保留供后续调用复用的内存 token 缓存；只合并未完成 Promise，finally 释放。
- 业务天数使用后端统一配置，未配置默认 14；前端不增加天数 env。持久 Cookie 截止为 `businessExpiresAt + 86_400_000`；未勾选省略 Max-Age/Expires。UI 默认未勾选保持不变。
- `now >= businessExpiresAt` 不得使用或续期；Cookie 多保存一天不是宽限期。元数据必须能从 token claims 单独重建，前端解析不替代后端验签。
- 续期只更新本次解析出的原来源；身份切换/退出后迟到结果不得覆盖新身份。不同标签页不声称原子 CAS。
- 后端统一鉴权、注销和旧凭证失效为已确认依赖；本期不新增后端注销服务、黑名单、OAuth、BFF 或 HttpOnly 改造。
- 同浏览器 HTTPS 同根域跨子域必须通过；不同根域只保留 RPC 尝试，浏览器阻止第三方存储时不保证静默 SSO。
- 所有 OpenSpec CLI 命令 cwd 为项目根 `doc/`；代码、构建、测试 cwd 为项目根。两者不得混淆，不创建根目录 openspec 软链接，不从 doc 根使用 official apply 实施源码；本文不提前归档。

## Review Focus

1. 缺少 remember/sessionId/renewAfter 的旧 token，或响应 meta 与签名 claims 不一致：版本 2 拒绝，不能刷新页面后猜测策略（Task 1、2）。
2. B 不属于 A 的 Cookie Domain、Domain 为公共后缀、同名 Cookie 遮蔽：B 仍可尝试 RPC；实际写入拒绝非法作用域或歧义（Task 2、3、9）。
3. A 换登录身份时 B 的续期/访客/RPC 才返回：丢弃旧结果，不清除新用户，不把远端凭证写 B（Task 4、5、6）。
4. 上传/POST 已发送后收到鉴权失败，以及 WS 旧身份重连：不自动重放副作用，不无限重连（Task 7）。
5. 旧浏览器页面、旧代理缓存与回滚包混用：能力不符明确失败，版本 2 激活后旧 key 不复活（Task 8、9）。

---

## Task 1: 建立测试工具与后端契约夹具门禁

**Files:**
- Modify: `common/package.json`、`common/package-lock.json`、`common/.gitignore`、`react-next-passport/package.json`、`react-next-passport/package-lock.json`、`react-next-passport/.gitignore`
- Create: `common/vitest.config.ts`、`common/tests/auth/setup.ts`、`react-next-passport/vitest.config.ts`、`react-next-passport/tests/auth/setup.ts`
- Create: `common/tests/auth/fixtures/session-contract.synthetic.json`、`common/tests/auth/fixtures/session-contract.recorded.json`、`common/tests/auth/fixtures/session-contract.schema.json`、`common/tests/auth/contract-fixtures.test.ts`
- Create: `deploy/verify-sso-contract.mjs`

**Interfaces:**
- Produces: 两宿主 `test:auth` 脚本为 `vitest run --config vitest.config.ts`；测试仅包含各自 `tests/auth/**/*.test.{ts,tsx}`，`@/` 分别解析到该宿主 `src/`，环境 jsdom，显式清理 mocks/timers。
- Produces: 夹具清单字段 `captureStatus: "synthetic" | "recorded-redacted"`、`capturedAt`、`backendVersion`、`login`、`renewal`、`invalidSession`、`claimMapping`、`timeUnit: "epoch-ms"`。每个响应保留真实 wire 结构，token 换成不可用于生产的结构等价脱敏样本。
- Produces: `node deploy/verify-sso-contract.mjs <fixture-path>`，只有已录制且元数据自足、登录/续期映射一致的夹具返回 0；其他返回非零并只打印字段名和缺失条件。

- [ ] **Step 1: 安装测试依赖并配置两个独立宿主的 alias/React 解析。** 在项目根运行下列未来实施命令；`--save-exact` 与 lockfile 固定实际安装版本，不混用 Common React 与 Passport React。

```bash
npm --prefix common install --save-dev --save-exact vitest jsdom @testing-library/react @testing-library/dom @playwright/test vite
npm --prefix react-next-passport install --save-dev --save-exact vitest jsdom @testing-library/react @testing-library/dom
```

- [ ] **Step 2: 创建夹具结构校验的失败测试。** 合成夹具标为 synthetic；recorded 文件在取得脱敏真实资料前明确为未通过状态，禁止伪填 backendVersion/capturedAt 冒充录制。检查以下断言：

```ts
expect(checkFixture(synthetic).releaseAllowed).toBe(false);
expect(checkFixture(withMissingClaim("renewAfter")).releaseAllowed).toBe(false);
expect(checkFixture(withResponseClaimMismatch("remember")).releaseAllowed).toBe(false);
expect(checkFixture(recordedAndSelfContained).releaseAllowed).toBe(true);
```

测试内部定义 `checkFixture` 为对 schema/校验 CLI 的测试封装；最后一个输入是测试构造的校验器正例，不作为发布证据。运行 `npm --prefix common run test:auth -- tests/auth/contract-fixtures.test.ts`，首次应因校验器缺失失败。

- [ ] **Step 3: 实现校验 CLI，并对接既有后端脱敏资料。** 固定登录请求的 `remember:boolean`、真实续期 URL/方法/请求体/响应及明确鉴权失败语义；确认默认业务 14 天由后端给出。全部 SessionMeta 必须可从 token 单独重建，reload/RPC 只传 token 也成立。若资料未取得，保留失败门禁，允许后续合成单测开发，但禁止激活凭证版本 2；不新增或假称真实 API。
- [ ] **Step 4: 验证测试通过、发布门禁如实反映证据。** 上述 Vitest 命令应 PASS；`node deploy/verify-sso-contract.mjs common/tests/auth/fixtures/session-contract.recorded.json` 只有真实录制完成才可退出 0。提交本任务列出的工具及脱敏文件，不提交账号、Cookie、私钥、完整用户资料或可用 token。

## Task 2: 严格配置、错误类型及 claims 映射

**Files:**
- Modify: `common/src/common/lib/Env.ts`、`common/src/common/lib/protocol/CrosProtocol.ts`、`common/package.json`、`common/package-lock.json`
- Modify: `react-next-passport/package.json`、`react-next-passport/package-lock.json`、`react-next-admin/package.json`、`react-next-admin/package-lock.json`、`react-next-im/package.json`、`react-next-im/package-lock.json`（共享代码的运行时依赖需四站一致）
- Create: `common/src/common/lib/auth/TokenTypes.ts`、`common/src/common/lib/auth/TokenStorageConfig.ts`、`common/src/common/lib/auth/TokenClaims.ts`、`common/src/common/lib/auth/AuthStorageError.ts`
- Test: `common/tests/auth/config.test.ts`、`common/tests/auth/claims.test.ts`

**Interfaces:**
- Produces: design 的 `ConcreteStorage, TokenSource, SessionMeta, ResolvedToken, TokenWriteOptions, RenewalResult, CookieConfig, TokenRequestContext`，集中从 `TokenTypes.ts` 导出；新增 `StorageType.COOKIE="cookie"`，原枚举值保持不变。
- Produces: `resolveTokenConfig(env: Record<string,string|undefined>, pageUrl: URL): TokenStorageConfig`；config 含 `credentialVersion:1|2, defaultStorage, tokenKey, visitorKey, userInfoKey, cookie, proxyUrl?, renewUrl?`。
- Produces: `decodeTokenClaims(token:string): unknown`、`readSessionMeta(token:string): SessionMeta`、`assertMetaMatchesToken(token:string, meta:SessionMeta): void`；映射仅来自 Task 1 核实的字段。
- Produces: `AuthStorageError extends Error`，只携带 design 的 `code` 与脱敏 message，不附 token。

- [ ] **Step 1: 写配置/claims 失败测试。** `validEnv` 为测试专用 TOKEN_KEY、受信 HTTPS API/proxy 配置。精确覆盖：

```ts
expect(resolveTokenConfig(validEnv, appUrl).defaultStorage).toBe(StorageType.LOCAL);
expect(resolveTokenConfig({...validEnv, NEXT_PUBLIC_SSO_CREDENTIAL_VERSION:"2"}, appUrl).tokenKey).toBe("test-token:v2");
expect(() => resolveTokenConfig({...validEnv, NEXT_PUBLIC_TOKEN_STORAGE:"COOKEI"}, appUrl)).toThrow("CONFIG_INVALID");
expect(() => resolveTokenConfig({...validEnv, NEXT_PUBLIC_TOKEN_STORAGE:"COOKIE", NEXT_PUBLIC_SSO_CREDENTIAL_VERSION:"1"}, appUrl)).toThrow("CONFIG_INVALID");
expect(() => readSessionMeta(missingRenewAfterToken)).toThrow("TOKEN_INVALID");
expect(() => assertMetaMatchesToken(validToken, {...validMeta, remember:!validMeta.remember})).toThrow("TOKEN_INVALID");
```

另加 base64url、嵌套 JSON body、Unicode、非安全整数、时间单位错误及 `issuedAt <= renewAfter < businessExpiresAt` 断言。运行 `npm --prefix common run test:auth -- tests/auth/config.test.ts tests/auth/claims.test.ts`，确认 RED。
- [ ] **Step 2: 实现上述接口。** Env 集中读取 design 配置，不增加 days env。版本 1 保留原 key；版本 2 才追加一次 `:v2`，用户资料及 visitor 分开。版本 2 的所有存储模式要求 renew URL 与受信 API origin；本地读不因缺少 proxy 而失败。使用公开后缀解析库 `tldts` 校验写入 Domain，未来执行 `npm --prefix common install --save-exact tldts`；B 读取不因其主机不匹配 A Domain 而被拒绝，实际写入时再校验。
- [ ] **Step 3: 将 common 确定的 tldts 精确版本加入另外三站的运行时 dependencies 与 lockfile。** 从 `common/package.json` 的 `dependencies.tldts` 读取版本，使用 Node `execFileSync("npm", ["--prefix", project, "install", "--save-exact", "tldts@" + version])` 分别处理 `react-next-passport`、`react-next-admin`、`react-next-im`，校验四站版本一致；禁止依赖 Common 的 node_modules 偶然被找到。
- [ ] **Step 4: 补齐 None+非 Secure、生产非 Secure、带协议/端口/路径的 Domain、公共后缀和无配置默认分支；重复上述命令应全部 PASS。** 确认测试环境无需真实 API，且 synthetic fixture 不改变 Task 1 门禁。
- [ ] **Step 5: 提交本任务文件。** 提交前查看差异，确认没有 hardcode 真实凭据或擅自改变后端时长。

## Task 3: Cookie 与本地存储适配器

**Files:**
- Create: `common/src/common/lib/auth/CookieTokenStore.ts`、`common/src/common/lib/auth/LocalTokenStore.ts`
- Test: `common/tests/auth/cookie-store.test.ts`、`common/tests/auth/local-store.test.ts`

**Interfaces:**
- Consumes: Task 2 的 config/types/errors、`assertMetaMatchesToken`。
- Produces: design 的 `readCookieToken(key):string|null`、`writeCookieToken(key,token,options,config):void`、`removeCookieToken(key,config):void`。
- Produces: `writeVisitorCookie(key:string,token:string,config:Pick<CookieConfig,"sameSite"|"secure">):void`；仅 B host-only 会话 Cookie，无 Domain/Max-Age/Expires，Path=/。LocalTokenStore 根据独立 visitorKey 选择该路径，访客删除也使用 host-only 范围，不套用登录 SessionMeta 或 A 的 Domain。
- Produces: `LocalTokenStore`，构造 `(config:TokenStorageConfig)`；`read(storage:ConcreteStorage,key:string):Promise<string|null>`、`write(storage,key,token:string,options?:TokenWriteOptions,expectedToken?:string):Promise<string>`、`remove(storage,key,expectedToken?:string):Promise<string|null>`。这三个方法只操作当前 origin，不访问 iframe。

- [ ] **Step 1: 写 Cookie 赋值捕获器与真实 jsdom 读取的失败测试。** 固定 `now=1_800_000_000_000`、`businessExpiresAt=now+14*86_400_000`，验证：

```ts
expect(persistentAssignment).toContain("Max-Age=1296000");
expect(persistentAssignment).toContain("Path=/");
expect(sessionAssignment).not.toMatch(/Max-Age|Expires/i);
expect(() => readCookieToken("test-token:v2")).toThrow("COOKIE_AMBIGUOUS");
await expect(store.write(StorageType.COOKIE, key, token, options, "different-token")).rejects.toMatchObject({code:"SESSION_CHANGED"});
```

分别构造重复同名 Cookie、特殊字符、空值、禁写和 UTF-8 超过 4096 字节的输入；确认一次编码/解码、按第一个 `=` 分割、读回失败报错。运行 `npm --prefix common run test:auth -- tests/auth/cookie-store.test.ts tests/auth/local-store.test.ts`，确认 RED。
- [ ] **Step 2: 实现接口。** Cookie 仅保存 token，先核对 options.meta 与 token；持久截止按业务截止+1天，不按“读取时间+天数”滚动。删除使用相同 Domain/Path/name。所有 LocalTokenStore 失败统一 Promise rejection；条件写前重读，空删除幂等，不宣称跨标签原子操作。
- [ ] **Step 3: 增加“不属于 A Domain 的 B 只读可正常返回 null、写入拒绝”的测试；重复命令应 PASS。** Cookie 属性的浏览器持久化真实性留给 Task 9，不能用 jsdom 模拟当真机证据。
- [ ] **Step 4: 提交本任务文件。**

## Task 4: RPC v2、共享代理与懒加载 iframe

**Files:**
- Modify: `common/src/common/lib/protocol/CrosProtocol.ts`、`common/src/common/lib/CrosStorage.ts`、`react-next-passport/src/app/(cros)/cros-storage/page.tsx`、`react-next-passport/src/app/(cros)/cros-storage-debug/page.tsx`
- Create: `common/src/common/lib/auth/StorageRpcClient.ts`、`common/src/common/lib/auth/StorageProxyHandler.ts`
- Test: `common/tests/auth/rpc-client.test.ts`、`common/tests/auth/proxy-handler.test.ts`

**Interfaces:**
- Consumes: LocalTokenStore 与 Task 2 config；代理端只用本地存储，不依赖 CrosStorage/TokenLifecycle。
- Produces: `StorageRpcClient(config)` 的 `get(storage,key):Promise<string|null>`、`set(storage,key,token,options?,expectedToken?):Promise<string>`、`remove(storage,key,expectedToken?):Promise<string|null>`、`destroy():void`。
- Produces: `installStorageProxyHandler(config, store:LocalTokenStore, monitor?:(event:unknown)=>void):()=>void`，返回卸载函数；两代理页面调用同一处理器。
- Produces: INIT v2 capabilities 与 design 的 request options/expectedToken/errorCode，保留旧 requestId/value/error。

- [ ] **Step 1: 写伪窗口消息测试。** mock iframe 的 contentWindow 为固定对象，断言错误 origin/source/requestId 均不 resolve；符合字段的合法响应 resolve。用 fake timers 验证 ready 等待加请求整体在 10 秒超时；destroy 后拒绝且清监听/计时器。断言：

```ts
expect(document.querySelector("#cros-storage-iframe")).toBeNull(); // 仅构造 client
await expect(cookieReadAgainstLegacyInit).rejects.toMatchObject({code:"RPC_UNSUPPORTED"});
await expect(delayedRequest).rejects.toMatchObject({code:"RPC_TIMEOUT"});
expect(parentStorageWriteSpy).not.toHaveBeenCalled();
expect(serializedMonitorEvents).not.toContain(secretToken);
```

运行 `npm --prefix common run test:auth -- tests/auth/rpc-client.test.ts tests/auth/proxy-handler.test.ts`，确认 RED。
- [ ] **Step 2: 实现懒加载 transport/共享处理器并接入两个代理页。** iframe 按 URL/origin 复用，拒绝同 id 的错误目标；A 校验 parent source/origin，B 校验 iframe source/origin。只允许当前 token/visitor key、兼容阶段的原 key 和 hello；能力不足的 v2/COOKIE/条件写立即失败。版本 1 保持旧 LOCAL/SESSION GET、SET、REMOVE 登录/退出兼容；debug 使用相同安全规则，只输出 key/命令/状态/长度等脱敏信息。
- [ ] **Step 3: 保留通用 get/set/remove 原路由，不在本任务引入 token 本地优先。** 加旧请求/新代理、条件更新失配、共享 Cookie 已删除、非法 key/command/options 测试；重复命令应 PASS。
- [ ] **Step 4: 提交本任务文件。** 共享处理器回源后通过 copy 更新 Passport，不编辑其共享副本。

## Task 5: 本地优先生命周期、续期与访客隔离

**Files:**
- Modify: `common/src/common/lib/CrosStorage.ts`
- Create: `common/src/common/lib/auth/SessionGateway.ts`、`common/src/common/lib/auth/TokenLifecycle.ts`
- Test: `common/tests/auth/session-gateway.test.ts`、`common/tests/auth/token-lifecycle.test.ts`、`common/tests/auth/visitor-races.test.ts`

**Interfaces:**
- Consumes: LocalTokenStore、StorageRpcClient、Task 1 真实 wire 映射及 Task 2 元数据解析。
- Produces: `SessionGateway.renew({token:string,signal:AbortSignal}):Promise<RenewalResult>`；实现直接 fetch，不调用 Fetcher。
- Produces: `TokenLifecycle(config,localStore,rpc,gateway,now?:()=>number)`，`resolveToken(storage?:StorageType):Promise<ResolvedToken|null>`、`renewResolvedToken(resolved:ResolvedToken):Promise<ResolvedToken>`、`getToken(storage?,generateVisitorToken?):Promise<string|null>`、`setToken(token,storage?,options?):Promise<string>`、`removeToken(storage?):Promise<string|null>`、`getTokenContext(storage?,generateVisitorToken?):Promise<TokenRequestContext|null>`、`invalidate(context:TokenRequestContext):Promise<void>`、`subscribe(listener:()=>void):()=>void`、`destroy():void`。
- Produces: CrosStorage 保留 design 中公开 token 方法签名，委托生命周期；同一页/凭证配置的实例共享 epoch 与失效通知，不能只取消某个组件实例；不使用共享 `lastSource`。

- [ ] **Step 1: 为本地命中/缺失/错误及业务时间写失败测试。** 三模式参数化；未完成并发 GET 合并，完成后的下一次调用重新读。设置 mock store/rpc/gateway，断言：

```ts
expect(rpc.get).not.toHaveBeenCalled(); // 本地真实登录凭证命中
expect(localStore.write).not.toHaveBeenCalled(); // token 来自 RPC
expect(gateway.renew).not.toHaveBeenCalled(); // now < renewAfter
await expect(atBusinessDeadline).rejects.toMatchObject({code:"TOKEN_EXPIRED"});
expect(gateway.renew).not.toHaveBeenCalled(); // now === businessExpiresAt
expect(rpc.set).toHaveBeenCalledWith(storage,key,newToken,{meta:newMeta},oldToken);
```

本地损坏、已过期、读权限拒绝均不得当作 absent 再取另一个身份。运行 `npm --prefix common run test:auth -- tests/auth/session-gateway.test.ts tests/auth/token-lifecycle.test.ts tests/auth/visitor-races.test.ts`，确认 RED。
- [ ] **Step 2: 实现版本分支及 gateway。** 版本 1 保留原模式/key读取；版本 2 按 B 本地→A RPC→合法访客顺序读取。到 renewAfter 但未到业务截止时先续期再返回；响应 meta 与 claims 一致、sessionId 相同、新截止更晚才更新原来源。B 显式登录在 A SET 成功后条件清理 B 独立旧凭证，共享 Domain Cookie 不重复删除；清理失败不报切换成功，A SET 失败保留原本地值，测试覆盖这三种分支。默认设计 wire 为 POST+Authorization原值+`{}`，但实际映射只按已录制夹具落在 gateway；AbortSignal 贯通，网络/5xx 不视为注销。
- [ ] **Step 3: 实现 epoch、条件写与访客竞争测试。** 退出/新登录取消在途结果；SESSION_CHANGED 最多重读来源一次。慢访客返回前重查登录 key/epoch，visitor 仅写 B 的 `${TOKEN_KEY}:v2:visitor`，不覆盖 A 登录 key；显式 storage 不丢失。失败 RPC 不生成访客。两个独立 lifecycle 模拟双标签，不把条件写称作原子 CAS。
- [ ] **Step 4: 全部上述测试 PASS；增加“第二次RPC读取仍请求A”和“续期后B未出现token副本”“两个实例中新登录使旧请求快照失效”“跨根域RPC明确空值后COOKIE访客写B host-only且不带A Domain”断言后提交。** 不创建定时延命循环，不以合成单测取代真实 gateway 门禁。

## Task 6: Passport 记住我、用户派生状态与页面恢复

**Files:**
- Modify: `react-next-passport/src/schema/sign-in.ts`、`react-next-passport/src/api/signin.ts`、`react-next-passport/src/app/(passport)/[locale]/sign-in/page.tsx`
- Modify: `common/src/common/lib/protocol/LoginUser.ts`、`common/src/common/hook/CrosStorageHook.tsx`、`common/src/common/components/header/user-profile.tsx`、`react-next-im/src/components/Login.tsx`
- Test: `react-next-passport/tests/auth/sign-in.test.tsx`、`common/tests/auth/user-state.test.tsx`

**Interfaces:**
- Consumes: CrosStorage 的 TokenWriteOptions 与 TokenLifecycle subscribe/invalidate。
- Produces: `toSignInRequest(form:FormData): {userName:string,password:string,captcha:string,remember:boolean}`（放在 signin.ts）；登录 adapter 返回 `{token:string,meta?:SessionMeta}`。版本 1 兼容原响应；版本 2 必须从 claims 重建 meta 并核对响应 meta，再传入 setToken options。
- Produces: `LoginUser` 使用版本对应的 userInfoKey，仅保存 UI 资料；页面恢复监听与 hook cleanup 不保存 token。

- [ ] **Step 1: 写表单/状态失败测试。** 使用 Passport 自身 React 测试配置，默认未勾选；两种提交分别发送 remember=false/true且不发送 rememberMe。拒写 Cookie 时不得 toast 成功或跳转；成功 await setToken 后才跳转。Common 测试断言空身份清 UI、超时保留为暂时错误不伪造注销、卸载 destroy 创建的实例。

```ts
expect(loginBody).toEqual({userName:"test-user",password:"test-password",captcha:"abcd",remember:false});
expect(loginBody).not.toHaveProperty("rememberMe");
expect(redirectSpy).not.toHaveBeenCalled(); // setToken rejected
expect(destroySpy).toHaveBeenCalledTimes(1);
```

运行 `npm --prefix react-next-passport run test:auth -- tests/auth/sign-in.test.tsx` 与 `npm --prefix common run test:auth -- tests/auth/user-state.test.tsx`，确认 RED。
- [ ] **Step 2: 实现提交适配、默认false、写入options和状态订阅。** `pageshow` 与 visibility变为visible触发一次重读并去重；过期/无身份清对应会话的资料，旧会话错误不清新身份。移除用户资料/token日志。IM两处显式setToken调用在版本2从claims重建options；版本1旧token仍能登录，不强制新元数据，分别加测试。
- [ ] **Step 3: 验证快速离开/返回、组件卸载时在途请求、旧续期返回后新登录三种竞争；重复两命令应 PASS。** 后端注销能力仅作为既有依赖调用/验收，禁止在此添加后端接口或黑名单。
- [ ] **Step 4: 提交本任务文件。**

## Task 7: HTTP、下载、上传与 WebSocket 一致消费

**Files:**
- Modify: `common/src/common/lib/Fetcher.ts`、`common/src/common/components/file/FileUploader.tsx`、`common/src/common/lib/SparrowWebSocket.ts`
- Test: `common/tests/auth/fetcher-auth.test.ts`、`common/tests/auth/uploader-auth.test.tsx`、`common/tests/auth/websocket-auth.test.ts`

**Interfaces:**
- Consumes: `CrosStorage.getTokenContext` 返回本次请求的 token、来源、sessionId、epoch 快照，失败时调用 `invalidate(context)`；原有调用仍兼容 getToken。保留 HTTP Authorization 原 token 字符串与 `new WebSocket(url,[token])` 协议。
- Produces: 三条消费链按同一身份代号处理明确鉴权失败；WS 异步 getToken reject 能结束 CONNECTING 状态并通知失败，失效停止旧会话重连。

- [ ] **Step 1: 写调用顺序和错误类型失败测试。** mock fetch、axios、WebSocket；令 renewal promise 可手动完成，验证其前业务请求数为0。验证失败 POST/上传发送次数为1，不自动重放；5xx不清会话；旧会话401不删新会话；WS旧凭证失效后没有重连定时器。

```ts
expect(businessFetch).not.toHaveBeenCalled(); // renewal pending
expect(uploadPost).toHaveBeenCalledTimes(1); // 已发送后鉴权失败
expect(newWebSocket).toHaveBeenCalledWith(wsUrl,[renewedToken]);
expect(reconnectWithOldToken).not.toHaveBeenCalled();
```

运行 `npm --prefix common run test:auth -- tests/auth/fetcher-auth.test.ts tests/auth/uploader-auth.test.tsx tests/auth/websocket-auth.test.ts`，确认 RED。
- [ ] **Step 2: 接入生命周期并补齐 Promise catch/finally。** GET/POST/download/upload/WS握手都先取统一token；明确鉴权失败归一处理，普通业务错误不清身份；WS重连每次重新取token，既有连接不会因Cookie变化自动变成新鉴权。不能自动重放已经发送的有副作用请求。
- [ ] **Step 3: 测试从配置错误、RPC超时、续期网络失败恢复后可再次发起请求；执行上述命令应 PASS。** 验证上传loading与WS状态均不永久卡住。
- [ ] **Step 4: 提交本任务文件。**

## Task 8: 四站配置、发布清单与防旧凭证回滚

**Files:**
- Modify: `common/.env.development`、`common/.env.production`、`react-next-passport/.env.development`、`react-next-passport/.env.production`、`react-next-admin/.env.development`、`react-next-admin/.env.production`、`react-next-im/.env.development`、`react-next-im/.env.production`
- Modify: `deploy/build-static.sh`、`deploy/deploy.sh`
- Create: `deploy/sso-release.mjs`、`deploy/tests/sso-release.test.mjs`
- Generated by copy/build only: 三站 `src/common/` 及四站 `out/sso-release.json`；不手改副本或提交构建out。

**Interfaces:**
- Consumes: Task 1发布门禁、Task 2配置与凭证版本。
- Produces: `node deploy/sso-release.mjs write <project-dir>` 读取该站生产公开配置并生成 out清单；字段严格为 design 中的 `protocolVersion,credentialNamespace,storageMode,proxyOrigin,cookieDomain,cookieSameSite,cookieSecure`；前两字段分别为数值 2 与配置值 1|2。
- Produces: `node deploy/sso-release.mjs validate <staged-sites-dir> <deploy-dir>`，四站一致、版本2代理能力及命名空间不低于部署根 `.sso-min-namespace.json` 才退出0。版本2激活在任何站点替换前持久记录最低版本；失败后修复也不可回落版本1。

- [ ] **Step 1: 用临时目录写部署失败测试。** 夹具包含四站index与sso-release，不调用真实部署目录；用现有脚本 `DEPLOY_DIR=<临时目录> ARTIFACTS_DIR=<临时包目录> bash deploy/deploy.sh` 测试不匹配包在替换前拒绝，原文件未变。激活版本2后 `rollback` 选中的版本1包也拒绝；同版本2旧代码包可通过。

```js
assert.equal(runDeploy(mismatchedBundle).status, 1);
assert.equal(readCurrentIndex(), originalIndex);
assert.equal(runRollback(retiredV1Bundle).status, 1);
assert.equal(validate(sameNamespaceV2Bundle).status, 0);
```

测试内实现这四个封装，只操作 `mkdtemp` 路径。运行 `node --test deploy/tests/sso-release.test.mjs`，确认 RED。
- [ ] **Step 2: 接入清单生成/校验。** build在copy/build后写清单，检查正式/debug代理静态产物存在；deploy解包校验后、任何rm/mv前验证清单与最低版本。保留当前CLI `rollback` 参数；不能盲选第二包绕过最低版本。版本2构建/部署都要求Task1记录门禁通过。
- [ ] **Step 3: 统一8份env但首次发布保持版本1、LOCAL，生产关闭CROS_DEBUG。** 不添加days env，不为TOKEN_KEY人工追加:v2，不使用未确认的续期URL占位值激活版本2；真实配置由已验证契约填写。阶段1新代理/三模式代码到齐后，阶段2四站一致设版本2并启用COOKIE、Domain=`sparrowzoo.com`与HTTPS属性，按后端既有能力令旧会话失效。该切换是未来发布步骤，不在本任务测试中操作生产。
- [ ] **Step 4: 测试PASS后运行copy和四站构建。** 命令 `bash deploy/copy-2-app.sh`、`bash deploy/build-static.sh`；核对共享源码复制差异，尤其保留审查Passport既有debugger差异的记录。以版本2当前命名空间重建回滚候选包，不能恢复旧LOCAL key；提交源码、配置及脚本，不提交产物/最低版本运行时记录。

## Task 9: 多origin浏览器、诊断页和真机联调验收

**Files:**
- Modify: `common/package.json`、`common/.gitignore`、`common/src/app/[locale]/cros/page.tsx`、`common/messages/example/zh.json`、`common/messages/example/en.json`
- Create: `common/tests/auth/playwright.config.ts`、`common/tests/auth/browser/serve.mjs`、`common/tests/auth/browser/index.html`、`common/tests/auth/browser/harness.ts`、`common/tests/auth/sso-browser.spec.ts`
- Create: `doc/openspec/changes/local-first-sso-token-storage/verification.md`（实施时记录证据，不预填通过）

**Interfaces:**
- Consumes: 实际共享生命周期/代理处理器及合成测试token；diagnostic用hello探针，不展示凭据。
- Produces: `test:auth:e2e` 脚本 `playwright test --config tests/auth/playwright.config.ts`。测试服务以Vite加载真实共享TS模块，生成只在os.tmpdir保留的短期TLS测试证书；固定端口4173，Chromium host-resolver将 `auth.sso.test`、`app.sso.test`、`app.other.test` 映射127.0.0.1，ignoreHTTPSErrors只限本地测试。
- Produces: harness通过测试专用控件驱动A写入/B读取/退出/延迟续期，断言Cookie由Playwright context.cookies读取；不把测试控制接口加入生产页面。

- [ ] **Step 1: 增加真实origin失败测试及诊断COOKIE选项。** `app.sso.test`读取共享Domain Cookie成功且iframe计数0；`app.other.test`仅以RPC尝试，成功后B cookie/localStorage/sessionStorage均无token副本。模拟阻止第三方Cookie时接受明确空值/分类错误，但不得伪报成功或回退LOCAL。

```ts
expect(await app.locator("#cros-storage-iframe").count()).toBe(0);
expect((await context.cookies(appOrigin)).filter(c=>c.name===encodedTokenKey)).toHaveLength(1);
expect(await otherOriginTokenCopies()).toEqual({cookie:null,local:null,session:null});
expect(persistentCookie.expires*1000).toBe(retainedUntil);
expect(sessionCookie.expires).toBe(-1);
```

测试禁写、同名、4KiB边界、原来源续期、晚到RPC/登出、业务截止时Cookie尚在但API不发送。未来首次安装浏览器命令 `npm --prefix common exec -- playwright install chromium`；随后 `npm --prefix common run test:auth:e2e` 应先RED再按前8项修复至PASS。
- [ ] **Step 2: 诊断页区分通用hello读写与token读取路线。** 只展示来源local/proxy、存储模式、requestId、错误码与耗时，不显示token/Authorization/完整用户资料；UI中不声称可区分未登录与浏览器静默隐藏Cookie。中英文文案同步。
- [ ] **Step 3: 执行真实后端和手机联调，记录待验收/通过/失败。** 使用受控测试账户验证配置未设置时14天业务规则、定制天数、会话Cookie、有效期内续期、业务到期强制重登；经既有后端退出后分别验证HTTP、下载、上传、已连WS旧会话被拒绝。记录实际URL origin、后端版本、字段映射、iOS Safari/Android Chrome版本、普通模式隐私设置及日期；微信内置单列。不得把Playwright Chromium或synthetic fixture当作真机/线上证据。
- [ ] **Step 4: 最终复核并交付。** 在项目根运行 `npm --prefix common run test:auth`、`npm --prefix react-next-passport run test:auth`、`npm --prefix common run test:auth:e2e`、`node --test deploy/tests/sso-release.test.mjs`、`bash deploy/build-static.sh`；在项目 `doc/` 运行 `openspec status --change local-first-sso-token-storage`、`openspec validate local-first-sso-token-storage --strict`。只在真实门禁、自动化及必要真机项通过后建议激活版本2；未完成项明确标注，不发布、不归档冒充完成。提交测试、诊断和验收记录。

## Handoff

- 顺序执行Task 1–9；Task 1真实后端夹具未通过时，可完成隔离的模拟实现，但版本2联调/激活保持禁止。
- 每个任务在其RED→GREEN验证通过后提交所列源码/测试文件；不得提交测试TLS私钥、真实token、out产物或运行时会话记录。独立代码审查需同时读取本计划及Spec。
- `projectRoot`：`/Users/zhanglizhi/workspace/sparrow/sparrow-js`；源码实施经指定项目根的 coder/Superpowers 执行。
- `openSpecWorkingDirectory`：`/Users/zhanglizhi/workspace/sparrow/sparrow-js/doc`；仅为规划 CLI 根，不是代码根。
- `changeRoot`：`/Users/zhanglizhi/workspace/sparrow/sparrow-js/doc/openspec/changes/local-first-sso-token-storage`。
- `planPath`：`/Users/zhanglizhi/workspace/sparrow/sparrow-js/doc/superpowers/plans/local-first-sso-token-storage.md`。
- 本计划尚未实施。方案审阅与实施授权完成后再使用已确认的执行方式推进。
