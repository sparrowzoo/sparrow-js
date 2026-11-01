# 消息协议重构：端到端验证

日期：2026-11-01。用户已明确要求端到端测试、直接启动本地测试环境，并同步修改服务端 ChatSession 逻辑。

**结论：主要消息收发、持久化及历史查询通过；完整验收仍有一项未通过——原有群资料缓存缺少写入流程。** 下述群名显示通过依赖显式准备的测试群缓存，不代表正式建群后的资料同步已通过。

## 范围与环境

验证当前工作区的前端公共消息模型，以及 `sparrow-chat` / `sparrow-messaging-gateway` 的对应服务端实现。前端基线为 `157ecbcbbf0c26427a90fa6fa9c0cd761e6ded05`；本轮没有提交或发布。

- 真实页面：Next.js 15.5.26，Playwright Chromium，两个独立浏览器用户。
- 测试前端使用 `127.0.0.1:3303` 和 `.next-messaging-e2e` 缓存；保留用户原有 3000–3003 开发服务。
- 真实后端：当前源码的 ApplicationBoot / Netty，HTTP `18889`、WebSocket `18081`。
- 专用 MySQL 8.4.13 / Redis 容器分别使用 `13306` / `16379`；数据库 `sparrow_e2e`。未连接真实业务库，未操作原有 8888 / 8080 服务。
- 合成用户 `900001`、`900002`，群 `900003`；不调用 AI、邮件或真实联系人。
- 临时环境及权限 600 的凭据位于 `/var/folders/fd/6b9qpfy15fz4z3mcnr6jvjc40000gn/T/sparrow-chat-e2e-backend-qyv8mqb_`，凭据不入仓库和报告。

## 验证结果

| 检查 | 结果与证据 |
| --- | --- |
| 前端协议、模型、分发回归 | 142 项通过；包含 Java 字节样本和 Base62 边界 |
| 真实页面 + 隔离 HTTP/WS 测试端 | 4 项通过：双向私聊、群聊、历史恢复、联系人类别更新后的路由/收件人、异常帧、心跳及历史搜索群名 |
| Java 公共消息协议 | `messaging-protocol` 26 项通过 |
| Java HTTP 会话模型及历史群 ID | `im-protocol` 8 项通过，覆盖所有 62 个类型字符、固定跨端样本、群 ID 提取、私聊排除及去重 |
| Java 历史搜索日期边界 | `im-infrastructure` 新增 4 项通过，覆盖同日、月末、闰日、年末及字段透传 |
| 真实 Java HTTP/WS 客户端 | 双向私聊、群聊、心跳、HTTP 重载及 MySQL 落库通过；`backend-smoke-result.json` |
| 数据库 Base62 存储 | 三张表各 5 个样本全部通过；大小写区分、126 字符单聊 key、255 字节英文/中文群聊 key，准确查询及逐字节回读；15 条记录全部回滚 |
| 真实浏览器 → Java → MySQL/Redis → 另一浏览器 | 双向私聊、群聊、刷新恢复和当天历史查询通过；未准备群资料缓存时，群名断言失败 |
| 显式准备测试群缓存后的真实浏览器 | 1 项完整场景通过，包含以上流程、群名、中文/emoji 及页面无运行异常；这是附带缓存前置条件的结果 |
| 当前前端类型检查 | `yarn tsc --noEmit --incremental false` 通过 |
| 前端生产构建 | 最终执行 `SPARROW_MESSAGING_E2E=1 yarn build` 通过，35/35 静态页面生成及导出完成；使用专用构建缓存 |

纯浏览器回归用到的是独立测试端，不代替真实 Java 验证。该测试端没有导入前端生产编解码器，独立检查发送字节。跨端固定样本为用户 `1/category=1` 与 `zzzzzzzzzz/category=61`，会话 key 为 `0z1Azzzzzzzzzz1`，同时验证中文和 emoji 消息。

## 本轮发现与处理

1. **UTF-8 文件移动后引用遗漏**：公共文件已移至 `common/lib/Utf8.ts`，三个协议文件仍引用旧位置，导致测试无法加载。已同步引用、复制下游并删除相同内容的废弃副本；142 项测试恢复通过。
2. **服务端 HTTP 会话解析仍按十进制**：`SessionDTO.parse` 对 `A–z` 抛异常。改为复用公共 `ChatSession.parse`，先复现失败再通过回归。Java 类名保持原样，不把前端展示模型带入协议层。
3. **Base62 在数据库中发生大小写混淆**：原排序规则实际将 `0Aexample` / `0aexample` 视作相等，原 64 字符宽度也不够。三个 PO、建表定义及升级脚本已统一为 `varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin`，保留非空、默认值和原索引，仅在隔离库执行验证。
4. **历史搜索群名取值错误**：页面用对象下标和会话 key 读取群信息，历史接口又返回 `QunDTO.id/name` 而非 `qunId/qunName`。页面现通过 Map 按群 ID 查找，`MessageApi` 在接口边界转换字段。测试端同步为真实 DTO 结构后先复现群名为空，再修复并通过全部 4 项浏览器回归。
5. **历史搜索漏掉结束日期当天的消息**：原后端把结束日期转为当天零点并使用 `<=`。真实 API 相同会话/关键字以今天截止返回 0 条、明天截止返回 2 条。现按原有 UTC+8 规则计算次日零点减 1 毫秒；修复后今天和明天均返回 2 条。未修改页面日期或查询条件掩盖此问题。
6. **后端把会话编号当成群 ID**：`HistoryMessageWrap.qunIds()` 原先返回 `1900003`，资料仓库需要 `900003`。现复用 `ChatSession.parse(...).getId()`；新增 4 项测试先有 3 项失败，修正后模块共 8 项通过。

真实搜索测试最初还漏选了页面要求的会话，已修正测试操作为先填写会话编号；日期问题另用明确会话编号的真实 API 对比确认。测试端也同步为按会话查询，避免它比真实接口接受更多输入。

## 未通过：群资料缓存没有自动生成

群 ID 修正并重启真实服务后，历史 API 返回 3 条群消息但 `qunMaps={}`；Redis 只有 `qun:member:900003`，没有 `qun:900003`。主代理与后端代理只读复核了当前源码和原有 HEAD：

- 正式建群 `QunController → QunService → contact QunRepositoryImpl.createQun` 只写群表和成员表；改群只更新数据库。
- 启动时 `ContactMQPublisher.start` 仅发布 `QunMemberEvent`，处理器只同步群成员。
- `RedisQunRepository.getQunMap` 只读群资料缓存，缺失时跳过，没有数据库补查。

这是原有群资料同步缺口，未在本轮扩展实现。后续需要确定并补齐群资料在创建、修改和缓存重建时的同步方式，再验证正常建群后无需人工准备缓存也能显示群名。当前不能宣布整个群资料流程通过。

为继续验证已修改的读取及页面链路，只向专用 Redis 补入合成群 `900003` 的 `QunDTO` 缓存。真实 API 随即返回 `id=900003/name=E2E Local Group`；浏览器最终 1 项完整场景通过。前置条件同时写入测试附件和 `group-cache-test-seed.json`。准备过程中曾使用错误的 Redis 序列化格式，产生一次 HTTP 500；按当前 `GenericJackson2JsonRedisSerializer` 的字符串格式修正后重新完整运行，最终通过。该环境准备失败不被计为产品通过证据。

## 代码与复跑入口

- 前端配置：`sparrow-chat/playwright.messaging.config.mjs`。
- 独立测试端及浏览器场景：`sparrow-chat/tests/e2e/messaging.fixture.mjs`、`messaging.spec.mjs`。
- 真实后端场景：`sparrow-chat/tests/e2e/real-backend.spec.mjs`。
- 服务端解析：`sparrow-chat/im/im-protocol/src/main/java/com/sparrow/chat/protocol/dto/SessionDTO.java`。
- 历史群 ID：`sparrow-chat/im/im-protocol/src/main/java/com/sparrow/chat/protocol/dto/HistoryMessageWrap.java`。
- 日期修复：`sparrow-chat/im/im-infrastructure/src/main/java/com/sparrow/chat/infrastructure/converter/MessageConverter.java`。
- 数据库升级：`sparrow-chat/sparrow-chat-boot/release-node/20261101-session-key-base62.sql`。

在前端 `sparrow-chat` 目录执行：

```sh
yarn test:protocol
yarn playwright test --config playwright.messaging.config.mjs
```

真实后端测试另设置 `MESSAGING_E2E_CREDENTIALS` 为本机专用 JSON 文件路径（包含 `apiUrl`、`wsUrl`、`sessionKey`、`groupSessionKey`、`users`；用户内含 `id/name/token`）。`MESSAGING_E2E_OUTPUT_DIR` 可指定报告目录。测试会启动自己的前端；API/WS 和专用测试数据需要事先准备。

报告与截图：

- 独立测试端：`/tmp/sparrow-messaging-e2e-20261101-complete/report.json`。
- 未准备群资料缓存的真实后端失败报告：`/tmp/sparrow-messaging-real-e2e-20261101-complete/report.json`。
- 显式准备缓存后的最终报告：`/tmp/sparrow-messaging-real-e2e-20261101-seeded-final/report.json`，1 项通过、0 失败。
- 最终截图：`/tmp/sparrow-messaging-real-e2e-20261101-seeded-final/real-backend-real-Java-bac-66c17-d-restore-persisted-history/real-history-search.png`；已目视确认非空消息、群名、会话编号和当天日期范围。同目录另含私聊与群聊刷新后的截图。
- 前端群字段回归失败记录：`/tmp/sparrow-messaging-group-map-red/report.json`；缓存序列化准备失败记录：`/tmp/sparrow-messaging-real-e2e-20261101-seeded/report.json`。
- 同目录包含页面截图；真实凭据模式关闭浏览器 trace，避免把请求凭据写入 trace。
- Java 日志：`/tmp/sparrow-messaging-protocol-green.log`、`/tmp/sparrow-session-dto-green.log`、`/tmp/sparrow-history-date-green.log`、`/tmp/sparrow-history-group-red.log`、`/tmp/sparrow-history-group-green.log`。
- 最终前端日志：`/tmp/sparrow-messaging-protocol-final.log`、`/tmp/sparrow-messaging-types-final.log`、`/tmp/sparrow-messaging-build-final.log`。
- 临时后端目录包含 `backend-smoke-result.json`、`session-key-storage-green.txt`、`history-end-date-fixed-comparison.json` 等证据。
- 同目录的 `group-history-map-before.json`、`group-history-map-after.json` 记录群缓存缺失；`group-history-map-seeded.json` 记录显式准备缓存后的真实 API 返回。
- `cleanup-result.json` 记录专用资源已清理、用户原有服务仍在运行。

## 边界及上线前事项

- 测试使用专用登录态，真实签名及 Redis session 校验保持启用；没有测试登录页面和验证码。现有开发登录接口未填 IP，会使消息持久化失败，因此测试凭据用隔离私钥补齐 loopback IP；没有修改生产认证逻辑或开发登录接口。
- 数据库升级脚本只扩大字段并修改比较规则，**不转换旧格式会话编号**。旧格式已有数据需要独立核对并迁移；本轮未修改任何真实库，也未执行上线。
- 历史消息跨月显示日期等其他原有问题不属于本轮会话协议验收范围。
- 构建日志包含已有环境颜色变量、Next 国际化缓存分析警告；实际页面检查以页面异常、收发结果和持久化记录为准。

## 评审结论

前端 142 项回归、Java 38 项相关单测、4 项隔离浏览器测试、数据库存储验证通过；真实后端主要消息流程通过，显式准备群资料缓存后 1 项完整浏览器场景通过。原有群资料缓存自动同步仍是未通过项，不能用测试种子掩盖。主代理检查代码、测试报告和截图，后端代理独立复核该缓存缺口。

用户已授权本轮验证和服务端会话同步；群资料自动同步未扩展实施。提交、真实库升级、旧编号数据迁移及发布均未执行。

收尾已停止专用 Java 进程并删除两个测试容器及其匿名卷；3303、18888、18889、18081、13306、16379 均已关闭，临时证据保留。用户原有 3000–3003、8888/8080 服务及其进程保持运行。清理脚本首次因 macOS `/var` 与 `/private/var` 路径别名拒绝操作；核对为同一目录并修正路径比较后完成，未放宽进程归属检查。三个仓库差异格式检查通过，未改变暂存状态。
