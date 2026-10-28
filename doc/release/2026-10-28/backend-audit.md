# 后端发版只读调查（2026-10-28）

本轮只读取 Git、源码、配置及既有报告，没有切分支、构建、启动、模型调用、SQL、提交或部署。下列行号均指调查时工作树。根目录为 `/Users/zhanglizhi/workspace/sparrow`，以下路径以此为前缀。SQL由其他调查负责。没有读取或记录凭据值。

## 版本范围与准确统计

三个项目都有独立 Git，均无 tag。用户未提供历史发版基线，因此以下比较是调查范围，不冒称“上个线上版本至今”。`git diff HEAD`只包括已跟踪及已暂存新文件，不包括未追踪文件；暂存与未暂存统计不可相加（同文件可两次变化）。

| 项目 | 当前分支/HEAD | 已提交比较 | HEAD到工作树 | 仅未暂存 | 仅暂存 | 未追踪文件数 |
|---|---|---|---|---|---|---|
| sparrow-chat | main / 86bf72e，与origin/main一致 | a876f0d（93fbe6a的父提交）→86bf72e：217 files,+3870/-2083 | 98 files,+661/-2050 | 58 files,+510/-402 | 50 files,+209/-1706 | 2 |
| sparrow-messaging-gateway | main / 4b27f26，与origin/main一致 | 初始文档11138d4→4b27f26：137 files,+9911/-30 | 50 files,+862/-373 | 49 files,+798/-315 | 3 files,+6/-0 | 2 |
| sparrow-agent | feature_req-r04-token-counter / f23db32 | main脚手架19fcddc→f23db32：374 files,+61568/-299 | 15 files,+1275/-390 | 15 files,+909/-338 | 6 files,+543/-229 | 4 |

chat的93fbe6a（2026-09-22）明确写“迁移聊天模块至 Jakarta 和 Springdoc 并修复构建”，父提交a876f0d是可证实的此次技术迁移前基线；其后包含合并，所以该范围还包括其他变化。最新86bf72e日期2026-09-26，今天的messaging抽取主要仍在未提交工作树，不应误写成已在main远端。

gateway完整历史仅5提交：11138d4(10/24职责文档)、e96a412(10/25模块/starter)、80b84e2(10/26生命周期/协议)、571bd6d(AI/IM分流)、4b27f26(订阅校验)。当前工作树进一步把EventType/DefaultEventType更名ProtocolType/DefaultProtocolType，增加AI_REQUEST=0/AI_RESPONSE=1和方向、即时/业务路由等，均未提交。

agent的main和origin/main仍为19fcddc脚手架，当前r04分支没有同名远端。已有远端分支r01=714b81c、r02=cb665a9、r03-chat-model-switch=67d7114、r03-video-production=4a0dbae；本地master/origin/master=652ea2a。近期73aa817(10/27)接messaging和Claude，67d7114统一模型切换，f23db32(10/28)快照tools/advisor。近期观察范围73aa817^→f23db32为360 files,+26567/-11277，包含文档、前端及原客服实现移除，不能全算新增业务。

## 实际业务调用链

### Gateway不是一台已独立实现的消息中间服务

主链是业务应用引入`com.sparrowzoo.messaging:messaging-starter:1.0.0-SNAPSHOT`，`@EnableMessage`装配本地发布策略、订阅表及内存多设备连接目录。见`messaging-starter/.../MessageConfiguration.java:39-105`、`messaging-domain/.../DefaultTypedPublisher.java:33-39`。默认TypedPublisher直接同步调用订阅者，没有跨进程投递。根POM虽聚合RocketMQ模块，README:5、52-58明确RocketMQ不在默认交付，SessionMessageSeed只有实体/DAO绑定，领号、校准、恢复尚未联调，不应宣称已具备可靠队列和断点恢复。

认证与接收：`messaging-infrastructure/.../WebSocketServerProtocolSupportHandshake.java:159-188`从`Sec-WebSocket-Protocol`读取token交由业务Authenticator，连接成功返回文本BIND事件；同账号同设备新连接替换旧连接。`WebSocketGateway.java:69-126`校验登录与连接对象，绑定可信用户，解析二进制帧并覆盖sender/device/loginUser，分别走即时订阅与业务发布，finally清上下文。即时ACK只是网关收到，不表示落库或模型完成。

当前协议见`messaging-protocol/.../Protocol.java:36-50,141-211`：1字节协议号，设备/聊天类型各1字节，消息类型2字节，payload长度4字节+UTF-8，时间长度1字节+时间文本，用户/会话段；多字节大端。DefaultProtocolType:26-51列AI请求0、回复1、IM8、ACK10、READ20、PING30/PONG40、状态查询45/下发50、ERROR-99。Java接口包已从chat/旧protocol搬到`com.sparrow.messaging`，EventType→ProtocolType源/二进制不兼容，需要同批重编所有调用方。

旧客户端的文本PING/状态指令不能直接用于当前二进制入口；旧时间尾缀拼接也已改为Protocol负责完整编码。客户端必须与当前协议配套，不能只替换后端jar。单聊用户类别0–9、ID长1–99 Java字符且UTF-8不超过255字节。保留旧sessionKey格式，但不代表整套旧协议兼容。

### Chat重构

`sparrow-chat-boot/.../ApplicationBoot.java:38-69`增加@EnableMessage，改为公共WebSocketServer；旧`im-domain/.../netty/WebSocketFrameHandler.java`全文件已注释，旧连接目录/协议类被删除或迁移。

`im-domain/.../service/subscriber/IMSubscriber.java:54-94`接IM，确认当前发送连接，设置服务器时间，调用ChatService.saveMessage，再单聊向接收者所有设备发、离线给发送者提示；群聊遍历群成员发送。当前该业务订阅者仅声明`IMMessageType.HTML`（119-125），不能只因有枚举就说所有IM类型都已接通。

`ChatService.java:92-95`写消息与session；公共连接目录替换原UserContainer。HTTP `/chat/v2`（ChatV2Controller:50-125）仍提供parse-token、current-user、login/long-login、online、session/read、sessions/messages/history/session-list/cancel。好友审核、群管理、联系人列表等保留。MessageConverter:89-110把Protocol.payload转正文，IP/device取自可信loginUser；PO新增device_type（im-po/.../Message.java:92-93），数据库升级需要配套核对。

### Agent真实能力与未实现目标

`agent-infrastructure/.../subscriber/ConsultMessageSubscriber.java:26-100`是当前实际AI链：AI_REQUEST + CONSULT(0)→克隆请求→单线程worker/100条内存等待队列→ChatClient.prompt().user(payload).tools(llmTools).call()→克隆回复、交换发送者接收者、设置AI_RESPONSE与时间→TypedPublishStrategy→DefaultTypedPublisher→ResponseConsultMessageSubscriber。回复订阅者`ResponseConsultMessageSubscriber.java:43-53`取receiver所有设备发送。没有调用ConversationService、历史存储、LLM上下文Repository或任务持久化。

当前`agent-adapter/.../ConversationController.java:41-75`的创建、列表、结束、转人工、取消，`MessageController.java:43-66`的发送、历史、回复、新消息共9个公开/api/cs方法全部直接抛UnsupportedOperationException。domain相应Service/Repository主要为接口；dao-mybatis只有POM，无实现。因此“可持久化智能客服、创建/结束咨询、历史补拉、人工接管、可靠接收/已读”是设计目标，不能放进已完成功能。旧MVP已删除；Jev、ES知识检索、LangGraph持久流程、多模态素材生产也没有在上述实际链路接通。

模型默认配置`agent-main-spring-boot/src/main/resources/application.properties:138-155`为codex-cli，路径CODEX_EXECUTABLE缺省/usr/local/bin/codex、60s、模型gpt-6-astra；embedding/image/audio等关闭。CodexProcessRunner:43-58要求绝对可执行路径、最长60秒、静态全进程单并发；89-120临时目录读取现有登录auth.json文件，不读取个人插件配置，当前工作树从旧exec改为app-server stdio。同步文本及工具调用，stream明确不支持（CodexTextChatModel:163-164）。CodexChatConfiguration:16-28装配CodexSessionAdvisor和TokenCounterAdvisor。Claude配置按spring.ai.model.chat=anthropic启用，环境变量ANTHROPIC_API_KEY/ANTHROPIC_AUTH_TOKEN、ANTHROPIC_BASE_URL、ANTHROPIC_MODEL；缺省模型claude-sonnet-4-6、1024 tokens、60s、不重试。当前base-url属性嵌套引用同名环境变量，未设置时为空；需目标环境核对。以上仅本地代码事实，不判断线上供应商可用性。

## 上线阻碍与具体证据

1. **已证实：chat撤回当前会空指针。** ChatV2Controller:123-131仍调用chatService.cancel；ChatService:109先执行messageRepository.cancel，再110设`List<Channel> channels=null`，111直接for。不是未被绑定的设计占位，不受其他分支保护；Controller捕获异常、记日志并返回false，会产生“删除已执行但推送失败、前端提示失败”的风险，不能以构建通过视作业务可用。
2. **已证实：agent业务API未实现。** 上述9个/api/cs公开接口都抛异常。只能以有限的WebSocket AI问答能力评估本次可用范围。
3. **已证实：AI模型失败没有正常投递处理器。** ConsultMessageSubscriber:90-100将回复改为ERROR后走业务发布；生产只有AI_REQUEST与AI_RESPONSE业务订阅。DefaultTypedPublisher:34-37找不到ERROR订阅将抛异常，外层worker仅记录日志。异步情况下不能再依赖网关捕获模型失败，用户可能只收到原ACK却没有最终失败提示。队列满的RejectedExecutionException也需要前端可见策略。
4. **高优先待验证：协议方向未被接入层执行。** `rg direction()`生产代码只见ProtocolType接口与枚举实现；WebSocketGateway未拒绝DOWNLINK类型，而AI_RESPONSE.needBusiness=true，ResponseConsultMessageSubscriber按客户端给的receiver发。需验证并限制客户端伪装AI下行回复；本轮未发攻击请求。
5. **已证实：内存队列与目录。** 模型请求在队列/进程内，没有落库、幂等或重启恢复；shutdownNow取消在途/排队。ACK不代表持久成功。不能按横向扩展或可靠客服交付。
6. **部署未固化。** agent已内嵌chat-starter，可选为IM+AI单一宿主，不必另起chat-boot；若确需分开运行，两者HTTP缺省均8888、公共WS均8080，同机需另分配。两者启动listener调用WebSocketServer.start阻塞至关闭，失败只log（ApplicationBoot:67-72、SparrowApplication:45-51）；HTTP健康不能证明WS已就绪。WS SSL=true使用临时自签证书，不是生产受信证书，需实际反向代理/TLS方案。
7. **待固化发布单。** 所有依赖仍1.0.0-SNAPSHOT，gateway协议与agent模型适配的关键改动未提交。必须保存准确代码SHA、依赖jar校验值、客户端版本及配置，才能追溯并回滚。

## 依赖、构建和启动对象

- 三项目父链依赖`com.sparrowzoo:infra-bom`和`sparrow-parent`。源码在`sparrow-shell/sparrow-bom/...`。父POM当前声明Java25、Boot4.0.8、SpringAI2.0.1（sparrow-parent/pom.xml:35-46）；gateway独立example却用Boot4.1.2、Java25（messaging-example/pom.xml:8,30），不能把example版本当三个服务统一版本。未运行effective-pom，不冒称本机缓存与源父POM一致。
- 基础源仓库：sparrow-shell提供sparrow、protocol、container、orm、json、authenticator等；sparrow-starter独立仓库；sparrow-passport-ddd提供passport-starter；sparrow-file独立仓库提供file-starter。chat-spring-starter/pom.xml:67-68实际依赖新file-starter。三个目标及shell/starter POM无`sparrow-integration`引用；旧integration的file-api不是file-starter，未见旧cms/blog等在本次链路。不能为发布新链直接全收旧integration删除。
- `sparrow-starter/pom.xml:28-30`有optional messaging-protocol编译依赖；infra-bom只是dependencyManagement记版本，不是依赖循环。gateway protocol只依赖shell的sparrow-protocol。建议源码构建顺序：父POM和shell基础→gateway messaging-bom/protocol→sparrow-starter/认证与文件组件→gateway其余→chat→agent。未发现gateway→chat/agent反向依赖。不可机械先全量starter再gateway，否则依赖缓存可能掩盖引导顺序。
- gateway是`com.sparrowzoo.messaging:messaging-gateway:1.0.0-SNAPSHOT`聚合POM，不应当一个生产可执行jar部署。messaging-example为`com.sparrow.messaging:messaging-example:0.0.1-SNAPSHOT`，默认greeting入口，可设example.main-class切WebSocketExampleApplication，仅测试示例。
- chat启动模块`com.sparrowzoo.chat:sparrow-chat-boot:1.0.0-SNAPSHOT`，main=`com.sparrow.chat.boot.ApplicationBoot`；原12talk-main-boot工作树重命名school-example-main-boot，是学校示例。agent启动模块`com.sparrow.agent:agent-main-spring-boot:1.0.0-SNAPSHOT`，main=`com.sparrow.agent.SparrowApplication`，finalName为artifactId-version。只有完成打包和环境核对后才可选`java -jar target/...jar`；本轮未执行这些命令。
- **运行宿主选法补正：** 仅IM可选chat-boot；本次IM+AI可选agent-main-spring-boot作为一个进程。agent POM:14-15明确依赖chat-spring-starter，SparrowApplication:24启用@EnableChatApp。EnableChatApp:27导入ChatAutoConfiguration，后者:28扫描com.sparrow.chat。starter POM:30-40、57-64引入联系人接入/实现/DAO与IM接入/实现，im-infrastructure POM:15-16再引入im-domain，IMSubscriber(@Named)、ChatV2Controller、ContactController(@RestController)因此在同一宿主装配，而不是要求部署chat-boot来供RPC。agent不依赖chat-boot模块，不会因引入starter就运行第二个ApplicationBoot入口。
- **同宿主事件可区分：** IMSubscriber登记(IM,HTML=0,非即时)，Consult登记(AI_REQUEST,CONSULT=0,非即时)，ResponseConsult登记(AI_RESPONSE,CONSULT=0,非即时)。gateway的IMEventSubscriber/AIEventSubscriber是即时ACK，TypedPubSubMappingContainer:36-39分别保存即时/业务表，业务再按protocolType+messageType取，编号同为0不会让IM与AI互相覆盖。AbstractSpringTypedSubscriber:41-44在单例初始化完成后登记最终Bean。前提是使用匹配的当前gateway、chat、agent依赖；这不是启动/业务验收通过声明。
- **单宿主仍有启动差异：** chat-boot ApplicationBoot:64-65显式调用ContactMQPublisher.start（5分钟群成员定期同步）和MessageService.startSyncSessionMeta（10秒会话元信息同步）；agent SparrowApplication没有这两处调用。ContactMQPublisher:79-82只初始化线程池，常规事件仍可发布，但没有自动安排start中的周期任务。因此不能宣称agent已完全等价覆盖chat-boot的所有后台维护行为；需按本次使用范围决定补齐或列为限制，不能通过双开两个宿主掩盖差异。
- 外部实际依赖是MySQL、Redis、Passport认证及模型CLI或Anthropic。HTTP配置8888、MySQL127.0.0.1/sparrow、Redis127.0.0.1:6379/db0是源码默认，不能推断线上目标。build过滤使用src/main/configs/${env}.properties，需固定env与外置配置来源，不能复制开发凭据。
- 部署顺序应先完成数据库兼容变更/数据备份、不可变依赖构建、模型登录或供应商配置和入口端口，再部署组合应用并验证认证+WS+IM+AI。这里是依据代码的待确认建议，未执行。
- 回滚需客户端/协议/业务jar组合回滚；仅回滚gateway会因EventType→ProtocolType导致调用方不兼容。数据库新device_type需兼容旧应用，不能直接删除生产新列或恢复旧库覆盖新数据。worker内存请求无法恢复，停机需交代排空/丢弃策略。

## 已有测试证据与提交排除项

本轮未跑测试，target/surefire和doc/reports都是既有文件，不能写本轮通过。agent现有报告中ChatModelSwitchTest 4/0失败、CodexToolCallingTest 10/0失败、TokenCounterAdvisorTest 7/0失败；CodexLiveToolCallingTest显示1跳过，AiMessageReceptionTest显示3项/1跳过，Claude配置测试3项/1跳过。不能据此宣称真实模型或完整浏览器业务通过。10/27并发报告`doc/req-r02-websocket-realtime/reports/server-reception/concurrency-20261027/report.md:5-28,62-71`记录当时并发失败/模型阻塞；当前已改为worker队列，旧失败的条件已变化，需复验。ERROR缺处理器仍从当前源码成立。

未追踪文件：gateway仅`docs/design/channel-event-type-trd.md`、`messaging-example/src/test/java/com/sparrow/messaging/messaging/example/ExampleApplicationsTest.java`；agent仅4个迁移到model/codex目录的测试；chat仅IMSubscriberTest、ChatMessageType.java。这些未追踪清单没有发现凭据/本地日志。仓库可能有已忽略文件，本轮不建议使用git add -f收集。agent的生产/dev配置与chat的RSA/private路径本来已在项目中；只报路径，必须由主代理在提交前做不显示值的密钥检测，不能因已跟踪就全量公开。agent新增fake-app-server.py测试夹具与新模型接入指南已在git diff HEAD统计内。

## 交付结论

代码能证明公共二进制消息入口、IM转发、WebSocket AI文本问答及模型切换/工具适配正在形成；不能把可靠客服、完整咨询管理、历史补拉、检索和素材生产写成已完成。当前有确定的撤回故障与AI失败投递缺口，且发布输入仍含多个工作树版本。本文是只读调查，不是上线批准或独立验收结论。
