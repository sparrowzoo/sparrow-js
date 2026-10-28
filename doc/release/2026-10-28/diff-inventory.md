# 2026-10-28 Git 变更清单

这是提交前快照，覆盖暂存、未暂存和未跟踪文件。未跟踪文件不包含在普通 git diff 统计中。历史比较基线仅是代码参照，不是生产已部署版本确认。

## sparrow-shell

- 分支：`master`；提交前 HEAD：`e702d6ead482bd2de727bd5730a550b9dbad0351`。
- 工作树：无已跟踪改动。
- 历史基线：`RELEASE-20261016`；候选比较基线；不代表已确认生产部署版本。

### 已提交历史范围

```text
e702d6e 2026-10-28 refactor: 更新依赖和用户协议并移除旧消息模块
```

### HEAD 至当前工作树的全部文件

```text
```

### 未跟踪文件

```text
无
```

## sparrow-starter

- 分支：`main`；提交前 HEAD：`e0d3077152239d0e46efbbed1387cb973b59fcd0`。
- 工作树：13 files changed, 73 insertions(+), 110 deletions(-)。
- 历史基线：`e0d3077152239d0e46efbbed1387cb973b59fcd0`；候选比较基线；不代表已确认生产部署版本。

### 已提交历史范围

```text
无新增提交
```

### HEAD 至当前工作树的全部文件

```text
M	pom.xml
M	src/main/java/com/sparrow/spring/filter/FlashFilter.java
M	src/main/java/com/sparrow/spring/filter/monitor/MonitorResult.java
D	src/main/java/com/sparrow/spring/mq/AbstractSpringMQHandler.java
M	src/main/java/com/sparrow/spring/mvc/ControllerReturnAdvice.java
M	src/main/java/com/sparrow/spring/mvc/ModelAndViewUtils.java
M	src/main/java/com/sparrow/spring/starter/autoconfiguration/DruidDataSourceAutoConfiguration.java
M	src/main/java/com/sparrow/spring/starter/autoconfiguration/MvcConfigurerAdapter.java
M	src/main/java/com/sparrow/spring/starter/autoconfiguration/RedisAutoConfiguration.java
M	src/main/java/com/sparrow/spring/starter/autoconfiguration/SparrowAutoConfiguration.java
M	src/main/java/com/sparrow/spring/starter/autoconfiguration/SparrowDataSourceAutoConfiguration.java
M	src/main/java/com/sparrow/spring/starter/autoconfiguration/TemplateEngineAutoConfiguration.java
M	src/main/java/com/sparrow/spring/starter/autoconfiguration/orm/SparrowORMAutoConfiguration.java
```

### 未跟踪文件

```text
src/test/java/com/sparrow/spring/mvc/ControllerReturnAdviceTest.java
```

## sparrow-chat

- 分支：`main`；提交前 HEAD：`86bf72e0647514aee1a00dcf9c22c9009bc30871`。
- 工作树：98 files changed, 661 insertions(+), 2050 deletions(-)。
- 历史基线：`86bf72e`；候选比较基线；不代表已确认生产部署版本。

### 已提交历史范围

```text
无新增提交
```

### HEAD 至当前工作树的全部文件

```text
M	bom/pom.xml
M	chat-spring-starter/pom.xml
D	chat-spring-starter/src/main/java/com/sparrow/chat/boot/config/ContactMvcConfigurerAdapter.java
M	chat-spring-starter/src/main/java/com/sparrow/chat/boot/controller/ContactHealthController.java
A	codex.sh
M	im/im-adapter/pom.xml
M	im/im-adapter/src/main/java/com/sparrow/chat/im/controller/ChatV2Controller.java
M	im/im-dao-sparrow/pom.xml
M	im/im-domain/pom.xml
D	im/im-domain/src/main/java/com/sparrow/chat/domain/bo/ChatSession.java
D	im/im-domain/src/main/java/com/sparrow/chat/domain/bo/ChatUser.java
D	im/im-domain/src/main/java/com/sparrow/chat/domain/bo/Protocol.java
D	im/im-domain/src/main/java/com/sparrow/chat/domain/demo/WebSocketClient.java
D	im/im-domain/src/main/java/com/sparrow/chat/domain/demo/WebSocketClientHandler.java
D	im/im-domain/src/main/java/com/sparrow/chat/domain/netty/CustomWebSocketFrameAggregator.java
D	im/im-domain/src/main/java/com/sparrow/chat/domain/netty/UserContainer.java
M	im/im-domain/src/main/java/com/sparrow/chat/domain/netty/WebSocketFrameHandler.java
D	im/im-domain/src/main/java/com/sparrow/chat/domain/netty/WebSocketIndexPageHandler.java
D	im/im-domain/src/main/java/com/sparrow/chat/domain/netty/WebSocketServer.java
D	im/im-domain/src/main/java/com/sparrow/chat/domain/netty/WebSocketServerIndexPage.java
D	im/im-domain/src/main/java/com/sparrow/chat/domain/netty/WebSocketServerInitializer.java
D	im/im-domain/src/main/java/com/sparrow/chat/domain/netty/WebSocketServerProtocolSupportHandshake.java
M	im/im-domain/src/main/java/com/sparrow/chat/domain/repository/MessageRepository.java
M	im/im-domain/src/main/java/com/sparrow/chat/domain/repository/SessionRepository.java
M	im/im-domain/src/main/java/com/sparrow/chat/domain/service/ChatService.java
M	im/im-domain/src/main/java/com/sparrow/chat/domain/service/UserLoginService.java
A	im/im-domain/src/main/java/com/sparrow/chat/domain/service/subscriber/IMSubscriber.java
M	im/im-infrastructure/pom.xml
M	im/im-infrastructure/src/main/java/com/sparrow/chat/infrastructure/commons/PropertyAccessBuilder.java
M	im/im-infrastructure/src/main/java/com/sparrow/chat/infrastructure/commons/TokenParser.java
M	im/im-infrastructure/src/main/java/com/sparrow/chat/infrastructure/converter/MessageConverter.java
M	im/im-infrastructure/src/main/java/com/sparrow/chat/infrastructure/converter/SessionConverter.java
M	im/im-infrastructure/src/main/java/com/sparrow/chat/infrastructure/mq/ContanctHandler.java
M	im/im-infrastructure/src/main/java/com/sparrow/chat/infrastructure/mq/QunMemberHandler.java
M	im/im-infrastructure/src/main/java/com/sparrow/chat/infrastructure/persistence/MessageRepositoryImpl.java
M	im/im-infrastructure/src/main/java/com/sparrow/chat/infrastructure/persistence/RedisContactsRepository.java
M	im/im-infrastructure/src/main/java/com/sparrow/chat/infrastructure/persistence/SessionMetaRepositoryImpl.java
M	im/im-infrastructure/src/main/java/com/sparrow/chat/infrastructure/persistence/SessionRepositoryImpl.java
M	im/im-po/src/main/java/com/sparrow/chat/im/po/Message.java
M	im/im-protocol/pom.xml
M	im/im-protocol/src/main/java/com/sparrow/chat/protocol/constant/Chat.java
M	im/im-protocol/src/main/java/com/sparrow/chat/protocol/dto/HistoryMessageWrap.java
M	im/im-protocol/src/main/java/com/sparrow/chat/protocol/dto/MessageDTO.java
R064	12talk-main-boot/src/main/java/com/sparrow/chat/boot/dao/UserCategory.java	im/im-protocol/src/main/java/com/sparrow/chat/protocol/enums/IMMessageType.java
R097	im/im-domain/src/main/java/com/sparrow/chat/domain/bo/CancelProtocol.java	im/im-protocol/src/main/java/com/sparrow/chat/protocol/im/CancelProtocol.java
M	im/im-protocol/src/main/java/com/sparrow/chat/protocol/query/ChatUserQuery.java
M	im/pom.xml
M	pom.xml
R085	12talk-main-boot/pom.xml	school-example-main-boot/pom.xml
R100	12talk-main-boot/src/main/configs/dev.properties	school-example-main-boot/src/main/configs/dev.properties
R100	12talk-main-boot/src/main/configs/prod.properties	school-example-main-boot/src/main/configs/prod.properties
R097	12talk-main-boot/src/main/java/com/sparrow/chat/boot/ApplicationBoot.java	school-example-main-boot/src/main/java/com/sparrow/chat/boot/ApplicationBoot.java
R063	im/im-domain/src/main/java/com/sparrow/chat/domain/bo/MessageKey.java	school-example-main-boot/src/main/java/com/sparrow/chat/boot/SchoolUserCategory.java
R092	12talk-main-boot/src/main/java/com/sparrow/chat/boot/config/ContactControllerAdvice.java	school-example-main-boot/src/main/java/com/sparrow/chat/boot/config/ContactControllerAdvice.java
R069	12talk-main-boot/src/main/java/com/sparrow/chat/boot/controller/ContactHealthController.java	school-example-main-boot/src/main/java/com/sparrow/chat/boot/controller/ContactHealthController.java
R100	12talk-main-boot/src/main/java/com/sparrow/chat/boot/dao/User12Talk.java	school-example-main-boot/src/main/java/com/sparrow/chat/boot/dao/User12Talk.java
R100	12talk-main-boot/src/main/java/com/sparrow/chat/boot/dao/User12TalkAdapterDaoImpl.java	school-example-main-boot/src/main/java/com/sparrow/chat/boot/dao/User12TalkAdapterDaoImpl.java
R097	12talk-main-boot/src/main/java/com/sparrow/chat/boot/dao/UserDaoImpl.java	school-example-main-boot/src/main/java/com/sparrow/chat/boot/dao/UserDaoImpl.java
R100	12talk-main-boot/src/main/resources/META-INF/resources/welcome.html	school-example-main-boot/src/main/resources/META-INF/resources/welcome.html
R100	12talk-main-boot/src/main/resources/META-INF/spring-devtools.properties	school-example-main-boot/src/main/resources/META-INF/spring-devtools.properties
R098	12talk-main-boot/src/main/resources/application.properties	school-example-main-boot/src/main/resources/application.properties
R100	12talk-main-boot/src/main/resources/logback.xml	school-example-main-boot/src/main/resources/logback.xml
R100	12talk-main-boot/src/main/resources/messages_zh_cn.properties	school-example-main-boot/src/main/resources/messages_zh_cn.properties
R100	12talk-main-boot/src/main/resources/system_config.properties	school-example-main-boot/src/main/resources/system_config.properties
R100	12talk-main-boot/src/main/resources/templates/index.html	school-example-main-boot/src/main/resources/templates/index.html
R100	12talk-main-boot/src/main/resources/templates/upload.html	school-example-main-boot/src/main/resources/templates/upload.html
R087	12talk-main-boot/src/test/java/com/sparrow/chat/chat/user/ChatSessionTest.java	school-example-main-boot/src/test/java/com/sparrow/chat/chat/user/ChatSessionTest.java
R100	12talk-main-boot/src/test/java/com/sparrow/chat/contact/test/ClassReaderTest.java	school-example-main-boot/src/test/java/com/sparrow/chat/contact/test/ClassReaderTest.java
R094	12talk-main-boot/src/test/java/com/sparrow/chat/contact/test/DruidDatasourceTest.java	school-example-main-boot/src/test/java/com/sparrow/chat/contact/test/DruidDatasourceTest.java
R093	12talk-main-boot/src/test/java/com/sparrow/chat/contact/test/FriendAuditTest.java	school-example-main-boot/src/test/java/com/sparrow/chat/contact/test/FriendAuditTest.java
R097	12talk-main-boot/src/test/java/com/sparrow/chat/contact/test/SecurityTest.java	school-example-main-boot/src/test/java/com/sparrow/chat/contact/test/SecurityTest.java
R093	12talk-main-boot/src/test/java/com/sparrow/chat/email/EmailTest.java	school-example-main-boot/src/test/java/com/sparrow/chat/email/EmailTest.java
R100	12talk-main-boot/src/test/java/com/sparrow/chat/email/PasswordRegexTest.java	school-example-main-boot/src/test/java/com/sparrow/chat/email/PasswordRegexTest.java
R096	12talk-main-boot/src/test/java/com/sparrow/chat/qun/test/QunTest.java	school-example-main-boot/src/test/java/com/sparrow/chat/qun/test/QunTest.java
R100	12talk-main-boot/src/test/resources/application.properties	school-example-main-boot/src/test/resources/application.properties
R100	12talk-main-boot/src/test/resources/sparrow_default.properties	school-example-main-boot/src/test/resources/sparrow_default.properties
R100	12talk-main-boot/tree	school-example-main-boot/tree
M	social-contact/contact-domain/pom.xml
M	social-contact/contact-domain/src/main/java/com/sparrow/chat/contact/service/AuditService.java
M	social-contact/contact-domain/src/main/java/com/sparrow/chat/contact/service/QunService.java
M	social-contact/contact-infrastructure/pom.xml
M	social-contact/contact-infrastructure/src/main/java/com/sparrow/chat/infrastructure/mq/ContactMQPublisher.java
M	social-contact/contact-protocol/pom.xml
M	social-contact/contact-protocol/src/main/java/com/sparrow/chat/contact/protocol/event/ContactEvent.java
M	social-contact/contact-protocol/src/main/java/com/sparrow/chat/contact/protocol/event/QunMemberEvent.java
R070	im/im-domain/src/main/java/com/sparrow/chat/domain/netty/Instruction.java	social-contact/contact-protocol/src/main/java/com/sparrow/chat/contact/protocol/event/RoutableContactEvent.java
M	social-contact/pom.xml
M	sparrow-chat-boot/pom.xml
M	sparrow-chat-boot/src/main/configs/dev.properties
M	sparrow-chat-boot/src/main/java/com/sparrow/chat/boot/ApplicationBoot.java
M	sparrow-chat-boot/src/main/resources/application.properties
M	sparrow-chat-boot/src/test/java/com/sparrow/chat/chat/user/ChatSessionTest.java
M	sparrow-chat-boot/src/test/java/com/sparrow/chat/contact/test/DruidDatasourceTest.java
M	sparrow-chat-boot/src/test/java/com/sparrow/chat/contact/test/FriendAuditTest.java
M	sparrow-chat-boot/src/test/java/com/sparrow/chat/contact/test/SecurityTest.java
M	sparrow-chat-boot/src/test/java/com/sparrow/chat/contact/test/SessionSyncTest.java
M	sparrow-chat-boot/src/test/java/com/sparrow/chat/email/EmailTest.java
M	sparrow-chat-boot/src/test/java/com/sparrow/chat/qun/test/QunTest.java
```

### 未跟踪文件

```text
im/im-domain/src/test/java/com/sparrow/chat/domain/service/IMSubscriberTest.java
im/im-protocol/src/main/java/com/sparrow/chat/protocol/constant/ChatMessageType.java
```

## sparrow-messaging-gateway

- 分支：`main`；提交前 HEAD：`4b27f265b44b7afb55153a0110f877e293891c74`。
- 工作树：50 files changed, 862 insertions(+), 373 deletions(-)。
- 历史基线：`None`；新项目，纳入从首次提交起全部历史及工作树。

### 已提交历史范围

```text
4b27f26 2026-10-26 fix: validate typed subscriptions and declare IM event types
571bd6d 2026-10-26 feat: separate AI and IM events and scope typed message routing
80b84e2 2026-10-26 fix: harden gateway lifecycle, connections and protocol handling
e96a412 2026-10-25 feat: establish messaging gateway modules and Spring starter
11138d4 2026-10-24 docs: describe messaging gateway responsibilities
```

### HEAD 至当前工作树的全部文件

```text
M	README.md
M	messaging-domain/src/main/java/com/sparrow/messaging/domain/service/MultiDeviceConnectionRegistry.java
M	messaging-domain/src/main/java/com/sparrow/messaging/domain/service/pub/sub/PublishStrategy.java
M	messaging-domain/src/main/java/com/sparrow/messaging/domain/service/pub/sub/RoutingKeyPublisherMapping.java
M	messaging-domain/src/main/java/com/sparrow/messaging/domain/service/pub/sub/typed/DefaultTypedPublisher.java
M	messaging-domain/src/main/java/com/sparrow/messaging/domain/service/pub/sub/typed/TypedPublishStrategy.java
M	messaging-domain/src/main/java/com/sparrow/messaging/domain/service/pub/sub/typed/mapping/TypedPubSubMappingContainer.java
M	messaging-domain/src/test/java/com/sparrow/messaging/domain/service/pub/sub/typed/mapping/TypedPubSubMappingContainerTest.java
M	messaging-example/src/main/java/com/sparrow/messaging/messaging/example/file/FileExampleApplication.java
M	messaging-example/src/main/java/com/sparrow/messaging/messaging/example/greeting/MessagingExampleApplication.java
M	messaging-example/src/main/java/com/sparrow/messaging/messaging/example/routing/RoutingExampleApplication.java
M	messaging-example/src/main/java/com/sparrow/messaging/messaging/example/typed/event/EventExampleClient.java
M	messaging-example/src/main/java/com/sparrow/messaging/messaging/example/typed/event/message/MessageExampleApplication.java
M	messaging-example/src/main/java/com/sparrow/messaging/messaging/example/typed/event/ping/PingExampleApplication.java
M	messaging-example/src/main/java/com/sparrow/messaging/messaging/example/typed/file/FileMessage.java
M	messaging-example/src/main/java/com/sparrow/messaging/messaging/example/typed/file/FileMessageReader.java
M	messaging-example/src/main/java/com/sparrow/messaging/messaging/example/typed/file/FileMessageSubscriber.java
M	messaging-example/src/main/java/com/sparrow/messaging/messaging/example/typed/file/FilePublisher.java
M	messaging-example/src/main/java/com/sparrow/messaging/messaging/example/typed/greeting/GreetingMessage.java
M	messaging-example/src/main/java/com/sparrow/messaging/messaging/example/typed/greeting/GreetingSubscriber.java
M	messaging-example/src/main/java/com/sparrow/messaging/messaging/example/typed/routing/RoutedMessage.java
M	messaging-example/src/main/java/com/sparrow/messaging/messaging/example/typed/routing/RoutedMessageSubscriber.java
M	messaging-example/src/main/java/com/sparrow/messaging/messaging/example/websocket/RealWebSocketClient.java
M	messaging-example/src/main/java/com/sparrow/messaging/messaging/example/websocket/WebSocketExampleApplication.java
M	messaging-example/src/main/java/com/sparrow/messaging/messaging/example/websocket/WebSocketMessageSubscriber.java
M	messaging-infrastructure/src/main/java/com/sparrow/messaging/infrastructure/service/netty/WebSocketGateway.java
M	messaging-infrastructure/src/main/java/com/sparrow/messaging/infrastructure/service/spring/LocalConfigRoutingKeyPublisherMapping.java
M	messaging-infrastructure/src/main/java/com/sparrow/messaging/infrastructure/service/spring/event/AIEventSubscriber.java
M	messaging-infrastructure/src/main/java/com/sparrow/messaging/infrastructure/service/spring/event/IMEventSubscriber.java
M	messaging-infrastructure/src/main/java/com/sparrow/messaging/infrastructure/service/spring/event/PingSubscriber.java
M	messaging-infrastructure/src/main/java/com/sparrow/messaging/infrastructure/service/spring/event/UserStatusEventSubscriber.java
M	messaging-infrastructure/src/test/java/com/sparrow/messaging/infrastructure/service/netty/WebSocketGatewayTest.java
M	messaging-infrastructure/src/test/java/com/sparrow/messaging/infrastructure/service/spring/event/ReplySubscriberTest.java
M	messaging-protocol/src/main/java/com/sparrow/messaging/protocol/ChatUser.java
M	messaging-protocol/src/main/java/com/sparrow/messaging/protocol/MessageType.java
M	messaging-protocol/src/main/java/com/sparrow/messaging/protocol/Protocol.java
M	messaging-protocol/src/main/java/com/sparrow/messaging/protocol/ProtocolSegmentIndex.java
R080	messaging-protocol/src/main/java/com/sparrow/messaging/protocol/EventType.java	messaging-protocol/src/main/java/com/sparrow/messaging/protocol/ProtocolType.java
M	messaging-protocol/src/main/java/com/sparrow/messaging/protocol/TypedEvent.java
M	messaging-protocol/src/main/java/com/sparrow/messaging/protocol/api/EventTypedHandlerMappingContainer.java
M	messaging-protocol/src/main/java/com/sparrow/messaging/protocol/api/TypedSubscriber.java
D	messaging-protocol/src/main/java/com/sparrow/messaging/protocol/enums/DefaultEventType.java
A	messaging-protocol/src/main/java/com/sparrow/messaging/protocol/enums/DefaultProtocolType.java
A	messaging-protocol/src/main/java/com/sparrow/messaging/protocol/enums/TransmissionDirection.java
M	messaging-protocol/src/test/java/com/sparrow/messaging/protocol/ProtocolValidationTest.java
M	messaging-rocketmq-client/pom.xml
M	messaging-starter/src/main/java/com/sparrow/messaging/starter/MessageConfiguration.java
M	messaging-starter/src/test/java/com/sparrow/messaging/starter/EnableMessageTest.java
M	messaging-starter/src/test/java/com/sparrow/messaging/starter/SubscriberProxyTest.java
M	messaging-starter/src/test/java/com/sparrow/messaging/starter/SubscriberStartupTest.java
```

### 未跟踪文件

```text
docs/design/channel-event-type-trd.md
messaging-example/src/test/java/com/sparrow/messaging/messaging/example/ExampleApplicationsTest.java
```

## sparrow-agent

- 分支：`feature_req-r04-token-counter`；提交前 HEAD：`f23db3292a7f1158ba5bd4701a27e441282ca389`。
- 工作树：15 files changed, 1275 insertions(+), 390 deletions(-)。
- 历史基线：`19fcddc`；分支 main 脚手架，只作新项目全量差异参照，非生产已上线版本。

### 已提交历史范围

```text
f23db32 2026-10-28 chore(chat): snapshot current tools and advisor baseline
67d7114 2026-10-27 refactor(chat): centralize Codex and Claude model switching
cb665a9 2026-10-27 chore(mobile): add Android and iOS native project scaffolds
73aa817 2026-10-27 feat(chat): integrate messaging and Claude while retaining Codex
86dc726 2026-10-24 refactor(realtime): align API contracts and persistence entities
e299b86 2026-10-23 docs: align WebSocket protocol and implementation plan
e736fef 2026-10-23 chore: reorganize agent modules and update customer service flow
ad12727 2026-10-16 chore: update architecture rules and Maven configuration
490e8e7 2026-10-16 docs: complete realtime TRD and implementation readiness review
4a90449 2026-10-16 docs: clarify immutable LLM messages and versioned configuration snapshots
433ca6e 2026-10-16 docs: define conversation APIs and ID-based LLM context records
c0bc177 2026-10-16 docs: define realtime event payloads with TEXT-only messages
ec97105 2026-10-16 docs: clarify timestamp cursors and remove subscription IDs
44c158b 2026-10-16 docs: refine binary WebSocket protocol and conversation lifecycle
652ea2a 2026-10-15 docs: separate WebSocket requirement and implementation plan
714b81c 2026-10-15 feat: integrate Codex CLI and close T13 acceptance
6459625 2026-10-15 chore: snapshot customer service implementation and validation records
0d621cd 2026-10-15 docs: specify WebSocket message delivery and connection binding
808ca6e 2026-10-14 chore: snapshot customer service planning and paused implementation
2a41894 2026-10-13 docs: document Jev use cases and ReAct boundaries
```

### HEAD 至当前工作树的全部文件

```text
M	README.md
D	agent-infrastructure/src/main/java/com/sparrow/agent/infrastructure/model/CodexProcessRunner.java
D	agent-infrastructure/src/main/java/com/sparrow/agent/infrastructure/model/CodexTextChatModel.java
R091	agent-infrastructure/src/main/java/com/sparrow/agent/infrastructure/model/CodexCliProperties.java	agent-infrastructure/src/main/java/com/sparrow/agent/infrastructure/model/codex/CodexCliProperties.java
A	agent-infrastructure/src/main/java/com/sparrow/agent/infrastructure/model/codex/CodexProcessRunner.java
A	agent-infrastructure/src/main/java/com/sparrow/agent/infrastructure/model/codex/CodexTextChatModel.java
A	agent-infrastructure/src/main/java/com/sparrow/agent/infrastructure/model/codex/advisor/CodexSessionAdvisor.java
D	agent-infrastructure/src/test/java/com/sparrow/agent/infrastructure/model/CodexProcessRunnerTest.java
D	agent-infrastructure/src/test/java/com/sparrow/agent/infrastructure/model/CodexTextChatModelTest.java
A	agent-infrastructure/src/test/resources/codex/fake-app-server.py
M	agent-main-spring-boot/src/main/java/com/sparrow/agent/configuration/ClaudeChatConfiguration.java
M	agent-main-spring-boot/src/main/java/com/sparrow/agent/configuration/CodexChatConfiguration.java
M	agent-main-spring-boot/src/test/java/com/sparrow/agent/configuration/ChatModelSwitchTest.java
M	agent-main-spring-boot/src/test/java/com/sparrow/agent/messaging/AiMessageReceptionTest.java
A	docs/Spring-AI自定义模型接入指南.md
```

### 未跟踪文件

```text
agent-infrastructure/src/test/java/com/sparrow/agent/infrastructure/model/codex/CodexLiveToolCallingTest.java
agent-infrastructure/src/test/java/com/sparrow/agent/infrastructure/model/codex/CodexProcessRunnerTest.java
agent-infrastructure/src/test/java/com/sparrow/agent/infrastructure/model/codex/CodexTextChatModelTest.java
agent-infrastructure/src/test/java/com/sparrow/agent/infrastructure/model/codex/CodexToolCallingTest.java
```

## sparrow-js

- 分支：`feature_req-im-customer-service`；提交前 HEAD：`d0fb80cedfee6bd3b7abf7f17721b9dd9b64e87c`。
- 工作树：106 files changed, 8211 insertions(+), 20972 deletions(-)。
- 历史基线：`f7bde8b`；候选比较基线；不代表已确认生产部署版本。

### 已提交历史范围

```text
d0fb80c 2026-10-21 chore: save project configuration and chat protocol updates
```

### HEAD 至当前工作树的全部文件

```text
A	codex.sh
M	common/.env.development
M	common/.env.production
M	common/messages/default/en.json
M	common/messages/default/zh.json
M	common/messages/website/en.json
M	common/messages/website/zh.json
M	common/src/app/[locale]/products/_components/service-product.tsx
M	common/src/common/lib/Env.ts
M	common/src/common/lib/Fetcher.ts
M	common/src/common/lib/SparrowWebSocket.ts
M	common/tests/auth/consumers.test.ts
A	common/tests/auth/fetcher-http.test.ts
M	deploy/build-static.sh
A	doc/req-java-protocol/evidence.md
A	doc/req-java-protocol/plan.md
A	package.json
M	sparrow-admin/.env.development
M	sparrow-admin/.env.production
M	sparrow-admin/messages/AdminUser/en.json
M	sparrow-admin/messages/AdminUser/zh.json
M	sparrow-admin/messages/App/en.json
M	sparrow-admin/messages/App/zh.json
M	sparrow-admin/messages/ColumnConfig/en.json
M	sparrow-admin/messages/ColumnConfig/zh.json
M	sparrow-admin/messages/DictItem/en.json
M	sparrow-admin/messages/DictItem/zh.json
M	sparrow-admin/messages/DictItemI18n/en.json
M	sparrow-admin/messages/DictItemI18n/zh.json
M	sparrow-admin/messages/DictType/en.json
M	sparrow-admin/messages/DictType/zh.json
M	sparrow-admin/messages/DictTypeI18n/en.json
M	sparrow-admin/messages/DictTypeI18n/zh.json
M	sparrow-admin/messages/MicroService/en.json
M	sparrow-admin/messages/MicroService/zh.json
M	sparrow-admin/messages/Organization/en.json
M	sparrow-admin/messages/Organization/zh.json
M	sparrow-admin/messages/Permission/en.json
M	sparrow-admin/messages/Permission/zh.json
M	sparrow-admin/messages/Position/en.json
M	sparrow-admin/messages/Position/zh.json
M	sparrow-admin/messages/ProjectConfig/en.json
M	sparrow-admin/messages/ProjectConfig/zh.json
M	sparrow-admin/messages/Role/en.json
M	sparrow-admin/messages/Role/zh.json
M	sparrow-admin/messages/TableConfig/en.json
M	sparrow-admin/messages/TableConfig/zh.json
M	sparrow-admin/messages/UserGroup/en.json
M	sparrow-admin/messages/UserGroup/zh.json
M	sparrow-admin/messages/default/en.json
M	sparrow-admin/messages/default/zh.json
M	sparrow-admin/package.json
M	sparrow-admin/src/api/manual/coder.ts
M	sparrow-admin/src/components/table-config/operation.tsx
D	sparrow-admin/yarn.lock
M	sparrow-chat/.env.development
M	sparrow-chat/.env.production
M	sparrow-chat/messages/en.d.json.ts
M	sparrow-chat/messages/en.json
M	sparrow-chat/messages/zh.json
M	sparrow-chat/package.json
A	sparrow-chat/src/app/(full)/[locale]/pop/ai/page.tsx
M	sparrow-chat/src/app/(full)/[locale]/pop/page.tsx
M	sparrow-chat/src/components/im/Talk.tsx
M	sparrow-chat/src/components/session/search/HistoryMessageItem.tsx
M	sparrow-chat/src/lib/im/MessageBroker.ts
M	sparrow-chat/src/lib/im/SessionContainer.ts
M	sparrow-chat/src/lib/protocol/Chat.ts
M	sparrow-chat/src/lib/protocol/ChatUser.ts
M	sparrow-chat/src/lib/protocol/Message.ts
M	sparrow-chat/src/lib/protocol/Protocol.ts
A	sparrow-chat/src/lib/protocol/Utf8.ts
M	sparrow-chat/src/lib/protocol/session/ChatSession.ts
A	sparrow-chat/tests/protocol/dispatch.test.ts
A	sparrow-chat/tests/protocol/fixtures/ProtocolFixtures.java
A	sparrow-chat/tests/protocol/fixtures/java-frames.json
A	sparrow-chat/tests/protocol/protocol.test.ts
A	sparrow-chat/vitest.protocol.config.mjs
M	sparrow-coder/.env.development
M	sparrow-coder/.env.production
M	sparrow-coder/messages/ColumnConfig/en.json
M	sparrow-coder/messages/ColumnConfig/zh.json
M	sparrow-coder/messages/ProjectConfig/en.json
M	sparrow-coder/messages/ProjectConfig/zh.json
M	sparrow-coder/messages/TableConfig/en.json
M	sparrow-coder/messages/TableConfig/zh.json
M	sparrow-coder/messages/default/en.json
M	sparrow-coder/messages/default/zh.json
M	sparrow-coder/package.json
M	sparrow-coder/src/api/manual/coder.ts
M	sparrow-coder/src/app/(i18n)/[locale]/project-config/page.tsx
M	sparrow-coder/src/components/table-config/operation.tsx
D	sparrow-coder/yarn.lock
M	sparrow-passport/.env.development
M	sparrow-passport/.env.production
M	sparrow-passport/messages/en.d.json.ts
M	sparrow-passport/messages/en.json
M	sparrow-passport/messages/zh.json
M	sparrow-passport/package.json
M	sparrow-passport/src/app/(passport)/[locale]/sign-in/page.tsx
M	sparrow-passport/src/components/passport/captcha-image.tsx
M	sparrow-passport/src/components/ui/avatar-editor/index.ts
M	sparrow-passport/src/schema/sign-in.ts
D	sparrow-passport/yarn.lock
D	sparrow/source/scripts/ImProtocol.js
R060	common/yarn.lock	yarn.lock
```

### 未跟踪文件

```text
common/src/app/[locale]/products/_components/im-customer-service.tsx
doc/yarn-workspaces/README.md
```

## sparrow-passport-ddd

- 分支：`main`；提交前 HEAD：`5cb58d45f6558f5c08721af615731d29e742c91e`。
- 工作树：15 files changed, 48 insertions(+), 31 deletions(-)。
- 历史基线：`5cb58d45f6558f5c08721af615731d29e742c91e`；候选比较基线；不代表已确认生产部署版本。

### 已提交历史范围

```text
无新增提交
```

### HEAD 至当前工作树的全部文件

```text
M	passport-adapter/src/main/java/com/sparrow/passport/controller/impl/UserLoginControllerImpl.java
M	passport-api/src/main/java/com/sparrow/passport/api/UserLoginService.java
M	passport-application/src/main/java/com/sparrow/passport/services/UserLoginApplicationService.java
M	passport-domain/src/main/java/com/sparrow/passport/domain/service/RegisteringUserService.java
M	passport-domain/src/main/java/com/sparrow/passport/domain/service/SecurityPrincipalService.java
M	passport-domain/src/main/java/com/sparrow/passport/domain/service/UserProfileService.java
M	passport-infrastructure/src/main/java/com/sparrow/passport/infrastructure/persistence/data/converter/RegisteringUserConverter.java
M	passport-main-spring-boot/.DS_Store
M	passport-main-spring-boot/pom.xml
M	passport-main-spring-boot/src/main/.DS_Store
M	passport-main-spring-boot/src/test/java/com/sparrow/spring/TestDemo.java
M	passport-mybatis-plus/pom.xml
M	passport-mybatis/pom.xml
M	passport-sparrow-dao/pom.xml
M	pom.xml
```

### 未跟踪文件

```text
.DS_Store
```

## sparrow-file

- 分支：`main`；提交前 HEAD：`49010da5818e6fba2a29554cb731ece02e3cee5b`。
- 工作树：1 file changed, 3 insertions(+), 2 deletions(-)。
- 历史基线：`49010da5818e6fba2a29554cb731ece02e3cee5b`；候选比较基线；不代表已确认生产部署版本。

### 已提交历史范围

```text
无新增提交
```

### HEAD 至当前工作树的全部文件

```text
M	file-starter/pom.xml
```

### 未跟踪文件

```text
无
```

## sparrow-security

- 分支：`main`；提交前 HEAD：`c0598939338aab50e817f2ce1b430742baddfec8`。
- 工作树：3 files changed, 6 insertions(+), 6 deletions(-)。
- 历史基线：`c0598939338aab50e817f2ce1b430742baddfec8`；候选比较基线；不代表已确认生产部署版本。

### 已提交历史范围

```text
无新增提交
```

### HEAD 至当前工作树的全部文件

```text
M	admin/security-admin-main-spring-boot/pom.xml
M	server/security-mybatis/pom.xml
M	server/security-sparrow-dao/pom.xml
```

### 未跟踪文件

```text
无
```

## sparrow-coder

- 分支：`master`；提交前 HEAD：`f186b8afdedbd409c63ef17f545d8ed4dc39c54d`。
- 工作树：11 files changed, 445 insertions(+), 5 deletions(-)。
- 历史基线：`f186b8afdedbd409c63ef17f545d8ed4dc39c54d`；候选比较基线；不代表已确认生产部署版本。

### 已提交历史范围

```text
无新增提交
```

### HEAD 至当前工作树的全部文件

```text
M	coder-adapter/src/main/java/com/sparrow/coder/adapter/controller/CoderController.java
M	coder-domain/pom.xml
M	coder-domain/src/main/java/com/sparrow/coder/domain/service/CodeGenerator.java
M	coder-domain/src/main/java/com/sparrow/coder/domain/service/DefaultCodeGenerator.java
A	coder-domain/src/main/java/com/sparrow/coder/domain/service/TableCreationService.java
M	coder-domain/src/main/java/com/sparrow/coder/domain/service/frontend/generator/column/ReactColumnGenerator.java
M	coder-domain/src/main/java/com/sparrow/coder/domain/service/registry/ValidatorRegistry.java
A	coder-domain/src/test/java/com/sparrow/coder/domain/service/TableCreationServiceTest.java
M	coder-domain/src/test/java/com/sparrow/coder/moke/beans/MockProjectConfigRepository.java
A	coder-protocol/src/main/java/com/sparrow/coder/protocol/dto/CreateTableResult.java
M	coder-spring-starter/pom.xml
```

### 未跟踪文件

```text
无
```

## sparrowzoo

- 分支：`bug_req-r03-compile`；提交前 HEAD：`416e71e9dbf1d76817ef2595f214434a706f9c1b`。
- 工作树：1 file changed, 1 insertion(+), 1 deletion(-)。
- 历史基线：`416e71e9dbf1d76817ef2595f214434a706f9c1b`；候选比较基线；不代表已确认生产部署版本。

### 已提交历史范围

```text
无新增提交
```

### HEAD 至当前工作树的全部文件

```text
M	src/main/java/com/sparrow/Application.java
```

### 未跟踪文件

```text
content/expo-57-mobile-scaffold-build-validation.json
content/http-status-result-business-errors.json
content/openai-billing-codex-api-guide.json
content/spring-ai-custom-model-codex-tools.json
content/spring-ai-tool-calling-source-analysis.json
doc/req-r03-compile/evidence.md
```

## 排除项

- `.DS_Store` 为本机文件元数据，不属于源码，不提交。
- 未使用 git add -f；忽略的密钥、缓存、构建输出不纳入。
- sparrow-integration 是旧仓库，未发现本次启动链直接依赖；其中大量旧模块删除不纳入本次提交。
- sparrow-shell 当前工作区干净，现有 e702d6e 已纳入版本记录，无需制造新提交。
