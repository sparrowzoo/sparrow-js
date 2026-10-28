# 实施记录

- 工作区：/Users/zhanglizhi/workspace/sparrow/sparrow-js
- 基线：d0fb80c；原分支 chore/yarn-workspaces。
- 已创建并切换 feature_req-java-protocol。既有未提交改动保留；本需求代码文件无原有未提交修改。sparrow-chat/package.json 只新增 test:protocol 命令，保留原有其他改动。
- 授权依据：用户确认具体协议规则并要求“实施吧”。

## 代码范围与结果

- Protocol.ts / Chat.ts：移除 version，device 采用 Java PC=1 / MOBILE=2 / APP=3；事件 ID、结束段、publishable 均来自 Java。正文、时间、用户、会话按 Java 顺序写入，ERROR 按有符号字节读取；两字节 messageType 用 JS 0–65535 表达。
- 时间为非负安全整数，避免 JS number 静默舍入；空正文解码为 null。事件结束段以外字段不要求提供，结束段后的多余字节按 Java 现状忽略。
- ChatUser / ChatSession：保留真实类别，同 ID 按类别排序，身份比较同时核对 ID 和类别，校验单聊长度、类别和 UTF-8 字节长度。
- Utf8.ts：对齐 Java 的 BOM 保留、未配对 UTF-16 代理项编码为 '?'、非法代理项 UTF-8 字节序列替换行为；有效 emoji 正常保留。
- Message / MessageBroker：控制事件不进入聊天列表，提供 onControlEvent 回调；PING 回复 PONG，PONG 刷新心跳，OFFLINE 调用离线通知。业务层暂无 ACK 等事件的额外 UI 行为，本次不虚构处理规则。
- common/src/common/lib/SparrowWebSocket.ts：增加心跳和状态报文工厂，聊天端配置二进制格式；默认文本行为保留。二进制接收支持 Blob 与 ArrayBuffer；发送支持有效缓冲区视图。
- HistoryMessageItem.tsx：因 receiver 正确声明为可空，同步改为非空时再查询接收者，避免群聊对 undefined 做 Map 查询。
- 删除 sparrow/source/scripts/ImProtocol.js；扫描未发现旧 ImProtocol、EventType.MESSAGE、protocol.version 调用残留。
- sparrow-chat/src/common 是既有忽略目录，本次只刷新其中 SparrowWebSocket.ts 以使用共享源的新接口；受版本控制的源仍为 common/src/common/lib/SparrowWebSocket.ts。

## 测试与复核

- T1 RED：协议初始 31 项测试中 21 项失败，确认旧顺序、短帧、设备和类别排序等差异可复现；控制接收与 WebSocket 6 项测试全部先失败。
- T2 / T3 GREEN：协议及接收入口初始 37/37 通过。
- 本地 Java Protocol 编码器实际生成 14 组样本，包括所有事件及群聊；fixture 源码为 sparrow-chat/tests/protocol/fixtures/ProtocolFixtures.java，结果为同目录 java-frames.json。生成命令：

```sh
java --class-path /Users/zhanglizhi/workspace/sparrow/sparrow-messaging-gateway/messaging-protocol/target/classes:/Users/zhanglizhi/workspace/sparrow/sparrow-shell/sparrow-protocol/target/classes sparrow-chat/tests/protocol/fixtures/ProtocolFixtures.java
```

- JS 对上述样本逐字节解码再编码一致。额外覆盖每个截断前缀、视图偏移、中文、空正文、UTF-8 长度边界、非法枚举、时间、安全整数、单聊排序及控制事件不写聊天列表。
- 只读代码复核发现 BOM 和孤立代理项的 Java/浏览器差异，已分别补失败测试并修正；另外通过 JShell 确认 Java 对非法代理项字节序列的替换规则并补 RED→GREEN 测试。
- 最终命令（在 sparrow-chat 目录执行）：`yarn test:protocol`，58/58 通过；`yarn tsc --noEmit --incremental false`，退出码 0；`git diff --check`，退出码 0。
- 共享模块回归（在 common 目录执行）：`yarn test:auth`，104 项通过、3 项失败。失败均来自未修改的 tests/auth/release-config.test.ts，引用不存在的旧目录 react-next-admin/.env.development 或 .env.production；未扩大本需求修改这些历史路径。
- 首次使用 yarn exec 时参数未按预期传递，导致误扫描整个仓库，已停止；该次结果不作为协议验证证据，后续均在对应工作目录用明确配置执行。

## 2026-10-26 本地联调

授权：用户明确要求“启动联调”。沿用 feature_req-java-protocol，不提交、不推送、不发布。此次启动现有本地进程及临时测试脚本，无数据库、Redis、Broker、真实用户数据或付费资源。

### 上轮服务（18:42 历史状态，最新状态见 20:18 联调记录）

| 服务 | 地址 | 进程 / 启动方式 | 状态 |
| --- | --- | --- | --- |
| 聊天前端 | http://localhost:3003/zh/ | PID 30555，sparrow-chat 下 yarn dev | HTTP 200，保留运行 |
| 认证前端 / 跨站存储 | http://localhost:3001/cros-storage/ | PID 31986，sparrow-passport 下 yarn dev | HTTP 200，保留运行 |
| Java 示例网关 | ws://127.0.0.1:8080/websocket | PID 30814，临时 ProtocolGateway.java 启动现有 WebSocketServer 和示例 Spring Beans | 仅绑定本地，保留运行 |
| 业务 HTTP API | http://localhost:8888 | 未发现运行实例 | 未启动，完整聊天页面的前置条件缺失 |

Java 使用现有 messaging-example 的 exampleAuthenticator、WebSocketMessageSubscriber 和实际 Netty 网关；示例身份为 1001 / 类别 1，业务消息类型为 101，不是聊天页面默认发送的 0。此示例仅验证协议和网关，不冒充完整聊天业务服务。

临时文件目录：`/var/folders/fd/6b9qpfy15fz4z3mcnr6jvjc40000gn/T/sparrow-protocol-integration-g8041vyz/`。包括启动 helper、从已有可执行 jar 提取的依赖、JS/浏览器测试脚本及 frontend.png；未修改网关仓库源码。停止环境时只停止上述本轮进程；临时目录在服务停止后可整组删除。进程环境和临时浏览器会话关闭即恢复，不改全局配置。

### 已通过

- check-wire.cjs 使用 esbuild 打包本次真实 Protocol / ChatUser，通过实际 WebSocket：示例认证、PING→PONG、IM→ACK、群聊空正文→ACK、USER_STATUS→内容段回复，共 5 项通过。
- 中文、emoji、clientSendTime、serverTime 以及 ACK 无用户段均按当前 JS 实现解码成功。
- 通过已安装 Chrome 的 Playwright，在实际页面源下发送真实 WebSocket，收到认证成功、PONG、ACK；正文“浏览器联调😀”保持一致。
- 页面和存储入口返回 HTTP 200。未安装任何依赖；Playwright 缺少自带浏览器时使用本机已有 Chrome。

### 联调发现 / 待返工

1. **T3：认证指令不匹配。** Java WebSocketServerProtocolSupportHandshake.BIND 为 `AUTH_BIND`，实际网络返回 `{code:"0",instruction:"AUTH_BIND"}`；common/src/common/lib/SparrowWebSocket.ts 仅识别 `AUTH`，不会触发 userAuthCallback、handshakeSuccess 或心跳。单次原始 WebSocket 交换通过不能覆盖此应用入口。
2. **T3：首个心跳晚于服务器超时。** 前端 heartTime=10000，Java IdleStateHandler 读超时也是 10 秒。临时测试仅适配认证指令后，保持观察 26 秒，结果 pongs=0 / open=false / heartbeat=inactive。此时服务端已在首条 PONG 之前关闭连接。
3. **修复方向已作临时验证。** 仅在隔离浏览器测试脚本中适配 AUTH_BIND 并设置 heartTime=5000，26 秒内收到 5 个 PONG，open=true / heartbeat=active。正式业务代码尚未应用该改动。建议共享接收器识别 AUTH_BIND 并保留 AUTH 兼容；仅聊天端在 connect 前将心跳设置为 5 秒，避免改变其他调用方默认行为。补对应回归用例后复验。
4. 完整页面未验收通过：当前没有真实登录态；8888 业务接口未运行，登录验证码请求连接被拒绝。浏览器跳转认证页时另捕获 Header/UserProfile hydration mismatch，属于认证页面回归线索，本轮不扩大修复。

持续连接诊断日志：`/tmp/sparrow-protocol-heartbeat-5s.log`。临时适配只为验证修复方向，不计作当前生产代码通过。临时浏览器已关闭，未改用户日常浏览器的登录态。

## 2026-10-26 20:18–20:24 真实业务后台联调

授权：用户告知后台已启动并要求联调测试。本轮只测试、定位及更新记录，未修业务代码。

### 环境核对

- 真实后台：PID 55698，com.sparrow.chat.boot.ApplicationBoot；HTTP 8888、WebSocket 8080。
- 已停止上一轮自行启动的临时示例网关 PID 30814，确认 8080 只由真实后台监听，避免 127.0.0.1 流量误连示例。
- 聊天前端 PID 30555（3003）与认证前端 PID 31986（3001）保留运行。未重启或修改用户启动的后台。
- 浏览器：本机 Chrome，Playwright 隔离会话，1440×1000。没有修改用户日常浏览器的 Cookie / 登录态。

### 实际测试结果

| 测试 | 实际结果 | 判断 |
| --- | --- | --- |
| POST /chat/v2/login.json，测试用户 1001 / 类别 1 | HTTP 200，code=0，返回 token | 接口返回成功，但登录态不可用 |
| 检查该 token 的已解码用户字段 | 无 deviceType | 失败，关键认证字段缺失 |
| GET /chat/v2/get-current-user.json，携带返回 token | HTTP 500 | 失败 |
| GET /contact/contacts.json，携带返回 token | HTTP 500 | 失败 |
| GET /chat/v2/sessions.json，携带返回 token | HTTP 500 | 失败 |
| 真实 ws://localhost:8080/websocket，以该 token 握手 | instruction=AUTH_BIND，code=10138，key=user_token_abnormal，随后关闭 | 认证失败 |
| 浏览器实际操作：/zh/login/ → 填 1001 → 点击登录 → 进入联系人页面 | 登录 200，联系人 500，网关返回相同认证错误并关闭 | 已在真实页面复现 |
| PING/PONG、消息发送、ACK、消息接收 | 认证失败，未进入这些阶段 | 未验证，不能沿用示例网关结果冒充通过 |

本轮没有成功发送业务消息，也没有创建或删除联系人、群组、历史消息或业务数据。测试仅申请测试用户 1001 的登录态并读取接口。测试 token 暂存文件已删除，未写入此文档或输出到报告。

### 定位依据

- 后台 im/im-domain/src/main/java/com/sparrow/chat/domain/service/UserLoginService.java:39–59 构建 DefaultLoginUser 时设置用户 ID、类别、IP、过期时间等，但未设置 deviceType。
- 实际 token 解码也确认字段缺失，浏览器标准 User-Agent 重新登录后同样缺失，因此不是脚本 User-Agent 造成的单独问题。
- 后台 logs/error.log 在 20:21:04 和 20:22:59 记录：`IllegalArgumentException: No enum constant com.sparrow.protocol.enums.DeviceType.null`；栈定位 DefaultSessionParser.java:41 → DefaultSessionManager.getSession → DefaultSecurityManager.authenticate → WebSocketServerProtocolSupportHandshake。
- DefaultSessionParser.generateKey 将设备拼入 session key，parse 再通过 DeviceType.valueOf 读取，null 设备无法被解析。
- 页面另捕获 hydration mismatch，记录为页面回归线索；当前首要阻断仍是后端认证。
- 前端 AUTH_BIND 识别与 10 秒心跳的已知问题源代码仍未改动；本轮因认证失败，尚未验证后续心跳行为。

测试脚本：上一轮临时目录下 check-real-backend.cjs / check-real-ui.cjs。脱敏浏览器结果：`/tmp/sparrow-real-ui-result.json`；页面截图：同目录 real-backend-ui.png。脚本未做运行时认证绕过或修改真实网关。

### 建议下一步范围

1. 后台测试登录服务从既有 SessionContext.getClientInfo() 取得设备类型，补入签发的 LoginUser；不要新增前端身份来源或伪造设备字段。
2. 前端接收 AUTH_BIND 并保留原 AUTH 兼容；仅聊天端将心跳设置为 5 秒。
3. 重跑真实后台的登录、联系人/会话读取、持续连接和双端消息收发；认证通过后再判断消息业务订阅及存储链路。

## 2026-10-26 20:29–20:46 正常登录与心跳修正、复验

### 授权和登录路径纠正

用户明确要求使用 http://localhost:3001/zh/sign-in/，随后告知已登录成功。后续只使用用户已有 Chrome 登录会话（用户 28），不再调用内部测试登录接口。前一轮关于 1001 测试登录 token 的失败仅属于该内部接口，不能作为正常登录流程的结论；本轮未修改后台登录服务。

用户进一步要求“SparrowWebSocket…PING PONG 有问题…这里请一起修正”，已授权前端心跳与相关接收入口返工；后台恢复运行后又明确要求继续测试。

### 实际改动

- common/src/common/lib/SparrowWebSocket.ts：接收 AUTH_BIND，同时保留 AUTH；心跳超时按当前 heartTime×3 计算，避免缩短周期后仍用旧超时；显式 close 时清理心跳及重连定时器；reconnect 复用 close 的清理，不重复执行。
- sparrow-chat/src/lib/im/MessageBroker.ts：在连接前将聊天心跳设为 5000ms。PING / PONG 使用本次 Protocol 编解码；共享默认发送工厂继续供其他调用方兼容，聊天调用方已配置二进制报文。
- 刷新忽略目录 sparrow-chat/src/common/lib/SparrowWebSocket.ts，保证实际页面使用共享源的新实现。
- 新增回归测试覆盖 AUTH_BIND 和 AUTH、完整 WebSocket→MessageBroker 二进制 PONG 回调、连续心跳、无 PONG 超时及 close 清理。未改后台业务代码。

### 自动验证

- RED：63 项中 4 项失败，复现 AUTH_BIND 不启动回调、10 秒发送周期、超时不随配置变化、close 后旧定时器仍运行。
- GREEN：sparrow-chat 下 `yarn test:protocol`，63/63 通过；`yarn tsc --noEmit --incremental false`，退出码 0。
- common 下 `yarn vitest run --config vitest.auth.config.mjs tests/auth/consumers.test.ts`，5/5 通过，包含原 token 原样作为 WebSocket subprotocol 的回归。
- `git diff --check` 通过。本轮没有依赖安装、提交、推送或发布。

### 真实后台复验

- 使用用户已登录的正常 Chrome 会话，页面为 http://localhost:3003/zh/chat/sessions/session/，本人会话 key 为 011022828。
- 正常登录后页面加载联系人与会话，不再以内部测试登录的 500 结果判断正常登录失败。
- 过程中后台 HTTP 8888 一度请求超时、WebSocket 握手 Pending；用户告知恢复后，HTTP 根入口 302、耗时约 15ms，随后继续复验。
- 当前代码下真实网关握手成功，前端进入认证成功回调并启动心跳。
- 原连接在 20:42:23、20:42:28、20:42:33 持续发出 1 字节二进制帧并收到 1 字节回复；后续持续到 20:43:58，约 95 秒未因 10 秒读超时断开。
- 通过 Chrome 网络消息面板 Hex 查看器核对：出站 1 字节为 `1E`（十进制 30，PING）；入站 1 字节为 `28`（十进制 40，PONG）。同期状态请求 9 字节，回复 30 字节；不再发送旧文本 PING / STATUS。
- 自动重连后再核对新连接，20:45:43、20:45:48、20:45:53 均按 5 秒持续发出 PING 并收到 PONG，验证重连后的正常认证及心跳仍有效。

### 消息收发的剩余阻断

- 页面出现用户在本人会话发送的 `hi`（20:44）；网络面板记录出站业务帧 33 字节，时间 20:44:00.150。
- 20:44:00.161 后台 logs/warn.log 明确记录：`IllegalStateException: No handler for message type 0, event type IM`，栈定位 DefaultTypedPublisher.java:36 → TypedPublishStrategy.java:49 → WebSocketGateway.java:88。
- 该消息未收到 ACK，服务器关闭连接；前端随后约 20 秒按已配置的心跳超时自动重连，并恢复 PONG 往返。因此此处不是心跳编解码问题，而是后台尚未注册 IM / messageType=0 的业务处理器。
- 消息气泡是本地预展示，不能作为后台接收、持久化或投递成功的证据。未创建后台 handler，也未将缺失处理器当作协议测试通过。
- 尝试在本人会话输入中文和 emoji 的测试消息时，电脑控制工具超时；未将这次不确定输入算作已发送或已验证。没有向其他用户发送消息。

## 评审结论

已授权的 SparrowWebSocket 心跳修正完成：63 项协议/分发测试、5 项共享调用方回归、类型检查和真实登录会话的持续二进制 PING/PONG 均通过。正常登录流程已恢复验证，内部测试登录接口的问题不再列为本轮阻断。

全量消息收发仍未通过：真实后台缺少 IM / messageType=0 处理器，消息被拒绝且无 ACK。T3 前端修正完成；T4 的完整业务收发验收待后台具备相应处理器后继续。用户现有登录态和运行服务保留，未提交、未发布。
