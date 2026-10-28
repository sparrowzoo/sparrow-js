# 2026-10-28 上线操作清单

状态：待上线版本；本轮是 Git/源码/SQL 静态核对与发版整理，不是生产部署或完整业务验收。用户已确认日期版本并授权提交依赖源码，未授权推送、合并、执行 SQL 或部署。AI 参数值由用户在发布时提供。

## 1. 版本范围与实际变化

本次覆盖 11 个相关仓库：sparrow-shell、sparrow-starter、sparrow-messaging-gateway、sparrow-chat、sparrow-agent、sparrow-js、sparrow-passport-ddd、sparrow-file、sparrow-security、sparrow-coder、sparrowzoo。完整提交前 SHA、分支、暂存与未暂存差异、未跟踪文件见 diff-inventory.json/md。shell 已有最新提交，本次没有再修改。

前端上一次发版记录是 2026-10-14（f7bde8b），本次包含其后的 d0fb80c 及所有相关工作树改动。shell 使用 RELEASE-20261016..e702d6e 作候选历史参照；该 tag 已声明 Java25/Boot4.0.8/AI2.0.1，不能写成此 tag 之后才首次升级 AI2.0。gateway 按新项目全部源码；agent 以 main 的 19fcddc 脚手架作全量参照，实际当前是 feature_req-r04-token-counter，不是 main。其他依赖按当前 HEAD 与工作树差异，不能据此声称已经覆盖生产旧版本以来的所有历史迁移。

主要改动：

- messaging 抽取公共二进制协议、WebSocket认证绑定/心跳/连接目录/类型发布订阅及RocketMQ适配模块；当前默认是进程内发布，不代表独立可靠消息服务已部署。
- chat 保留联系人、会话、IM业务，替换通用Netty与协议实现。消息落库新增 device_type。
- agent 接入AI_REQUEST/AI_RESPONSE文本问答，Codex app-server双向工具调用、模型装配与用量统计；HTTP咨询管理与历史持久化仍未实现，流式方法不支持。
- 前端新增AI客服页、产品入口、协议解析和心跳重构，HTTP错误处理/多语言改进；登录token键统一为Authorization，管理站新增DDL生成/建表操作；根Yarn workspaces统一依赖与四站静态包。
- shell/BOM 删除旧MQ模块，infra-bom改管messaging-protocol，引入LangGraph4j1.9.4，Druid Boot4、MySQL驱动坐标迁移；LoginUser设备字段改枚举并增加IP，统一用户分类。
- starter 适配Boot4自动配置，保留HTTP错误状态、防止Result双层包装、减少错误日志敏感正文；passport同步游客/注册/登录/头像重签的设备和IP，file/security/coder更新MySQL驱动；coder新增受业务检查的DDL创建服务。
- sparrowzoo修正WebSocketServer导入，并新增5篇博客文章。文章在外部content目录，不包含在应用JAR中。

## 2. 当前不能直接放行的问题

这些是当前代码证据，不会在本次发版整理中擅自修改业务实现：

1. chat撤回：ChatService.cancel先调用repository.cancel，再对置为null的channels遍历；Controller捕获异常返回false，可能已删除但没有通知。须修复并回归，或明确本次不开放撤回入口。
2. AI失败提示：模型异常转ERROR，但当前业务订阅只有AI_REQUEST/AI_RESPONSE，没有对应ERROR处理器；异步请求可能只有ACK，没有最终失败提示。须验证模型超时、失败与队列满的客户端行为。
3. 业务HTTP：agent的9个/api/cs方法仍直接UnsupportedOperationException。不得以完整咨询管理、可靠历史补拉、转人工或已读持久化作为本次已实现承诺。
4. 方向校验：ProtocolType声明上/下行方向，但未见网关执行方向拒绝；AI_RESPONSE会进入业务路由。必须验证客户端不能伪装下行回复、越权发给其他用户。本轮未发攻击请求。
5. SQL及历史类别：按后文核对生产实际表结构、用户类别与sessionKey；不能直接运行历史DROP脚本。
6. 集成宿主维护任务：agent启动类没有原chat-boot显式启动的群成员定时同步和会话元数据同步；不能仅凭Controller与Subscriber被扫描就认为所有chat行为等价，须核对并完成回归。
7. 生产参数：用户提供AI联系人和类别；参数必须构建前注入，不是要求改业务代码。当前旧生产分类映射与新代码存在冲突，必须据真实账号确认。

本轮各仓库 git diff --check 通过，但没有重新做跨仓库构建、数据库迁移演练、生产配置静态构建或浏览器完整IM+AI联调；现有target报告只作历史参考。提交源码不等于通过上线验收。

## 3. 上线前固定代码与构建输入

- 保存每仓库提交SHA、当前分支及各产物SHA-256；多仓库提交不是一个原子事务，后续修复也须更新整套记录。
- 不对所有仓库机械git pull main：agent与前端在功能分支，拉main无法得到本次能力。发布时按提交清单检出。
- Maven大量依赖仍为1.0.0-SNAPSHOT。仅同名版本不能保证二进制一致，须在干净构建环境使用这组源码构建并保留仓库坐标、依赖树和产物校验值。不可误用本机旧缓存。
- Java构建/运行基线按父POM为25；gateway example另用Boot4.1.2，仅是示例，不作为生产宿主版本。Node>=22、Yarn1.22.19。
- 内部依赖仓库必须可访问；此前security-admin-starter下载403，本机曾安装依赖缓存。这个缓存不能代替部署机依赖可用性证明。
- 父POM默认skipTests=true；验证要明确-DskipTests=false，真实模型测试需要单独授权环境与凭据，不能将跳过算通过。

构建顺序（是依赖顺序，尚未执行或证明干净环境一次通过）：

1. sparrow-shell/sparrow-bom/sparrow-parent 与 infra-bom，再shell基础组件。
2. gateway/bom，再gateway/messaging-protocol。sparrow-starter即使optional，也编译依赖该protocol。
3. sparrow-starter；passport、file及实际宿主需要的security/coder依赖。父POM采用空relativePath的子模块，须先安装或发布其BOM。
4. gateway其余运行模块，再chat，最后agent及sparrowzoo。不要把gateway聚合POM或messaging-example当生产应用JAR。
5. 各服务针对实际启动模块执行生产配置打包与测试，示意为mvn -B -Pprod -DskipTests=false clean verify；项目BOM尚未安装时须按上一顺序先install。不能直接把这条示意当跨仓库一键构建脚本。

## 4. 环境变量与类别核对

前端生产构建需要的KEY如下；值由用户提供，禁止把模型密钥放入NEXT_PUBLIC变量：

| KEY | 填写/核对要求 |
| --- | --- |
| NEXT_PUBLIC_SERVER_ID_ARRAY_AI | AI账号ID列表，英文逗号分隔，须能从联系人接口查到。 |
| NEXT_PUBLIC_USER_CATEGORY_AI | 必须等于这些AI用户的实际category。当前公共枚举AI=2。 |
| NEXT_PUBLIC_SERVER_ID_ARRAY | 人工客服账号ID列表。 |
| NEXT_PUBLIC_SESSION_CATEGORY_GROUP | JSON对象，按当前客服category给出可展示的对方类别数组。 |
| NEXT_PUBLIC_SESSION_CATEGORY_NAME_MAPPING | category与分组翻译键的JSON映射。 |
| NEXT_PUBLIC_USER_CATEGORY_ADMIN | 共享管理员判断；旧生产为2，与新AI=2冲突，不能照抄旧值。 |
| NEXT_PUBLIC_USER_CATEGORY_VISITOR | 默认0，与后端一致。 |
| NEXT_PUBLIC_USER_CATEGORY_REGISTER | 默认1，与后端一致。 |
| NEXT_PUBLIC_API | 生产HTTP入口，现有为https://api.sparrowzoo.com。 |
| NEXT_PUBLIC_WEBSOCKET | 生产WS入口，现有为wss://api.sparrowzoo.com/websocket。 |
| NEXT_PUBLIC_TOKEN_COOKIE_DOMAIN | 核对共享登录域与各站点一致。 |

旧生产category：0访客、1注册、3学生、5分销、6客服；新开发配置：0访客、1注册、2AI、3客服、4学生、5教师、6分销。category参与身份判断、二进制编码和sessionKey，不只是显示标签。必须确认是否需要历史用户/联系人/会话键映射，不允许直接批量改category而不处理引用。仅凭代码不能给出生产UPDATE语句。

NEXT_PUBLIC_*会写入静态产物，必须在执行build前配置；只在Nginx或服务器进程环境新增变量不会改变已构建页面。禁止在文档或发版页写入实际账号token或模型密钥。

Agent模型二选一：

- 默认配置spring.ai.model.chat=codex-cli，CODEX_EXECUTABLE指定绝对可执行路径，运行账号需要有效Codex登录状态；当前模型名和60秒超时需按目标环境核对，不继承开发者个人登录态或依赖某次本机CLI安装。
- Anthropic：设置spring.ai.model.chat=anthropic（可用SPRING_AI_MODEL_CHAT），ANTHROPIC_API_KEY或ANTHROPIC_AUTH_TOKEN、ANTHROPIC_BASE_URL、ANTHROPIC_MODEL；不要同时误启另一套模型。base-url当前嵌套同名变量，无配置时需确认解析结果。
- 数据库/Redis/认证配置使用目标环境外置值；文档不复制开发账号密码。MySQL schema、Redis DB/前缀、JWT密钥及可信域必须与登录站及业务服务一致。

## 5. SQL执行准备与顺序

详见 sql-audit.md 的文件与行号；它是静态调查，不是已批准可直接执行的生产SQL。

先由数据库操作方保存SHOW CREATE TABLE、索引、记录量及可恢复备份，至少覆盖t_user、t_message、t_session、t_session_meta、t_contact和本次实际发布的security表；确认当前库是否还存在旧user/message/session/contact等名字，以及已执行的历史迁移。

确定的本次新增列是t_message.device_type，代码会赋值后落库。仅在确认列不存在且目标表为t_message之后，候选增量为：

```sql
ALTER TABLE t_message
  ADD COLUMN device_type INT NOT NULL DEFAULT 0 COMMENT '设备类型';
```

DEFAULT 0只为历史消息提供旧值，不证明历史设备类型已经恢复；须确认是否需要业务回填。执行前评估表大小、DDL锁表/在线DDL能力，并在恢复副本演练。本次未执行该语句，也未假定生产缺列。

现存兼容核对项：t_user.host（当前注册会写，现有脚本缺覆盖）、tenant_id的NULL与NOT NULL差异、用户名/email唯一约束及旧timestamp/varchar类型。只有确认生产缺列/有空值后才形成相应增量、回填和约束收紧；不能照实体自动删除旧列或替换整表。

历史20250421/23/30.sql已包含改名、category/english_name、session同步字段和tenant_id；不要重复执行。20250430.sql:25缺分号且开头DROP t_session_meta，chat t_user.sql和security release.sh/release.sql也含DROP重建或演示数据，禁止作为现存生产库升级入口。

Agent t_cs_message与gateway t_messaging_seed尚无接通的实际持久化链，不是当前问答演示启动前盲目建表的指令。若发布目标包含可靠历史、幂等和重启恢复，需另行完成代码与迁移后才能承诺。

## 6. 后端、网关与反向代理

agent-main-spring-boot依赖chat-spring-starter且使用@EnableChatApp，可作为IM+AI组合宿主；必须验证运行时两类subscriber与HTTP Controller均已装配。gateway是内嵌starter，不是必须另外启动的独立消息网站服务。不要同时用默认端口启动两个宿主。

HTTP默认8888；WS无JVM ssl属性时默认8080，可用-Dport调整，绑定地址为-Dhost；一旦存在-Dssl（即使写false）也会启用SSL分支，默认8443且使用自签证书。生产通常由Nginx终止TLS，必须核对其WS上游到底用HTTP还是HTTPS。不要把SERVER_PORT当作Netty WS端口配置。

当前前端Nginx配置API上游127.0.0.1:8888、WS上游127.0.0.1:8080；页面HTTPS必须配WSS并保留Upgrade/Connection头、认证subprotocol转发。HTTP健康检查成功不代表WS已监听或模型可用。

按现有进程管理器部署实际组合宿主，先备份旧JAR、配置和校验值；当前仓库不足以确认服务器systemd名称，不杜撰restart命令。不在生产临时启动messaging-example代替网关。

## 7. 前端构建与四站发布

值由部署方准备后，在sparrow-js根目录执行；build脚本不会自动install：

```bash
yarn install --frozen-lockfile
bash deploy/build-static.sh
test -s sparrow-chat/out/zh/pop/ai/index.html
test -s sparrow-chat/out/en/pop/ai/index.html
test -s common/out/release-node/2026-10-28.html
```

构建common、admin、chat、passport，生成artifacts/yyyyMMddHHmmss.tar.gz，包顶层为www/admin/im/passport；不包含独立sparrow-coder站点。前端root AGENTS与实际脚本采用Yarn，common/AGENTS旧npm段不作为本次操作依据。构建前确认公共代码复制已执行，并检查真实生产环境变量进入AI页面，不能只看四站index.html存在。

先在隔离环境用这组后端与静态包回归；通过后上传已校验包并保留上一包。服务器操作命令仅供发布时使用，本轮不执行：

```bash
DEPLOY_DIR=/workspace/deploy ARTIFACTS_DIR=/workspace/artifacts bash deploy/deploy.sh deploy
```

部署脚本按文件名取最新包，核对打印的包名确为本次构建。它对四站依次删除/移动，不是原子切换，应安排窗口防止新旧四站短时混用。静态网站由Nginx提供，无需Next Node进程常驻。

已有静态路由能处理/zh/pop/ai/，无需为此凭空新增location。若实际修改Nginx配置，先按服务器实际安装路径nginx -t，成功后再reload。

## 8. 上线验收与回退

验收至少覆盖：访客取token、注册/登录及旧登录重新认证、token字段/IP/设备和类别、联系人/会话及历史、IM收发/群聊/撤回、AI完整请求与回复、模型失败/超时/队列满、二进制PING/PONG、断线重连、多设备、非法帧与下行伪装拒绝。Authorization存储键与旧sparrow_sso_token不同，需要观察旧浏览器登录过渡；配套四站同时升级。

发版页与中文/英文AI页面应可访问；浏览器无JS错误，HTTP错误保留对应状态且Result不重复包装；新device_type写入成功。AI与IM是否可用必须通过真实端到端操作，ACK不能当作已持久化。

回退须固定上一套前端、应用、协议依赖及配置，不能只回gateway。当前前端命令：

```bash
DEPLOY_DIR=/workspace/deploy ARTIFACTS_DIR=/workspace/artifacts bash deploy/deploy.sh rollback
```

该脚本仅选目录里第二新包，不知道哪包真正在线，也不回退后端或数据库。须先核对包名与校验值，不能重复盲跑。回退应用尽量保留向后兼容新增列，禁止为回退删除device_type/清空会话表或把旧全库备份覆盖上线后的新消息。若发生真实数据损坏，先停写并按已演练的恢复点恢复与核对。

模型队列当前在内存中，停机/重启可能丢失在途请求；需安排停止接入、等待完成或明确失败提示，再切换。没有持久化补偿能力，不能写成自动恢复。

## 9. 本轮交付与授权记录

用户确认版本按日期2026-10-28；明确允许一并提交本项目依赖源码。AI环境变量值由用户提供。Git提交记录另见提交清单；未推送、未合并、未打发布tag、未执行SQL、未部署。当前结论为“发版资料已整理，仍有上线前必须处理/核对事项”，不是“生产可直接放行”。
