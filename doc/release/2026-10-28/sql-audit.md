# SQL 发版只读调查（2026-10-28）

范围：/Users/zhanglizhi/workspace/sparrow 下 chat、messaging-gateway、agent、passport-ddd、security、starter、integration，并搜索 sparrowzoo、sparrow-zoo、sparrow-js、sparrow-shell 补充来源。未连接数据库、未执行 SQL、未启动环境，不能确认生产实际结构或历史发版起点。路径以下相对该工作根。

## 结论

没有找到一套可直接用于当前生产升级、包含用户字段变化、聊天字段变化、客服持久化与种子表的安全完整增量 SQL。不能按文件名日期把历史脚本全部重跑。需先获取生产各表 SHOW CREATE TABLE 和已执行迁移记录（由授权环境另行核验），再生成定向增量及回填与回退方案。

## 代码与 SQL 差异

1. Passport 用户实体：`sparrow-passport-ddd/passport-dao-api/src/main/java/com/sparrow/passport/po/User.java:28` 映射 `t_user`。当前列集合为 user_id、tenant_id、user_name、nick_name、email、password、gender、avatar、nationality、personal_signature、birthday、mobile、last_login_time、activate、activate_time、channel、device、host、device_model、ip、category、english_name、status、gmt_create、gmt_modified。tenant_id 是 NOT NULL default 0（39）；user_name/email 标 unique（43、57）；host varchar(64) NOT NULL default ''（132）。
2. `sparrow-passport-ddd/user.sql:1` 仍建 `user`，旧字段定义：user_name 8、nick_name 20、password 50、avatar/email/signature 200、mobile 13；activate_time/last_login_time 为 timestamp，create_time/update_time 为 timestamp，ip 为 varchar(30)，status varchar(10)，channel 500，device/device_id/device_model 255。缺实体的 tenant_id、nationality、host、category、english_name、gmt_create、gmt_modified；多 secret_mobile、cent、is_online、zone、website、device_id、group_level。不是迁移。
3. `sparrow-passport-ddd/passport-dao-api/bin/$workspace/sparrow/sparrow-zoo/table/ddl/user.sql:1` 以 DROP 重建 `user`；采用 bigint 时间/ip、部分新长度，但仍缺 tenant_id、nationality、host、category、english_name，保留 cent、group_level、secret_mobile、device_id；多数列可 NULL，缺 user_name/email 唯一索引；主键重复 AUTO_INCREMENT（4）。不是生产增量。
4. `sparrow-chat/sparrow-chat-boot/sql/t_user.sql:23` DROP 重建 t_user，带演示账号数据（55-62，勿用于生产）；结构比 Passport 当前实体缺 tenant_id 和 host；额外 device_id。user_name/email 仅普通列，无唯一索引。此脚本不能解决当前生产字段升级。
5. 当前普通 MyBatis 例子仍读 `user`：`sparrow-passport-ddd/passport-mybatis/src/main/resources/mapper/UserMapper.xml:24`；MyBatis-Plus XML 为空（22-23）。需按实际发布 DAO 选择核实，不能全库重命名后假定所有 DAO 自动兼容。
6. 注册转换会写 tenant_id=0、category、english_name、host 默认空：`sparrow-passport-ddd/passport-infrastructure/src/main/java/com/sparrow/passport/infrastructure/persistence/data/converter/RegisteringUserConverter.java:56`、61-74。因此字段问题影响真实注册写库，不只是文档。

## 聊天表逐项清单

| 表 | 当前结构依据 | 迁移来源与风险 |
|---|---|---|
| t_user | Passport User.java:28-186 | chat release-node/20250421.sql:1 重命名 user；20250423.sql:1-3 增 category/english_name；20250430.sql:28-29 增 tenant_id 为可 NULL，与 PO NOT NULL 不一致；无 host 增量；无历史类型/时间回填。|
| t_contact | social-contact/contact-po/src/main/java/com/sparrow/chat/contact/po/Contact.java:24-59，id/user_id/friend_id/apply_time/audit_time | contact.sql:1 建旧名 contact 并 DROP；20250421.sql:3 改名。无新增平台/租户归属字段或对应迁移。user_id/friend_id 历史关联必须保持，不能靠重建用户重新发号。|
| t_session | im/im-po/src/main/java/com/sparrow/chat/im/po/Session.java:26-58 | bin/sql/session.sql:1 建旧名 session，user_id varchar(64)；20250421.sql:5 改名；20250430.sql:22-25 加 sync_time/status 并把 user_id 改 unsigned int。25 行末缺分号，后接 28 行 ALTER t_user，原样执行有语法错误且可能已产生前置 DDL。PO 的 user_id 是 signed int，与脚本 unsigned 不同。|
| t_session_meta | im/im-po/src/main/java/com/sparrow/chat/im/po/SessionMeta.java:27-71 | 20250430.sql:1-19 DROP+CREATE；含会话双方 user_id/category/name/nickname、is_visitor 等。脚本 user/opposite_category 为 tinyint，PO 定义 int；PO 多处 columnDefinition 注释引号不完整（40、52、70），opposite_id int DEFAULT ''（49），不能拿生成器输出当迁移。|
| t_message | im/im-po/src/main/java/com/sparrow/chat/im/po/Message.java:25-93 | bin/sql/message.sql:1 建旧名 message；20250421.sql:4 改名。当前未提交新增 device_type int NOT NULL default 0（92-93），全仓现有 SQL 没对应 ALTER。MessageRepositoryImpl.java:114 实际调用 messageDao.insert，因此是上线前真实字段缺失风险。|
| t_qun/t_qun_member/t_audit | contact-po 对应 PO 的 @Table | 20250421.sql:2,6,7 改名。初始化脚本仍旧名；qun.sql:1 DROP t_qun 但第2行 CREATE qun，尤其不可盲跑。audit/contact 的 id 含重复 AUTO_INCREMENT。|
| t_customer_service | contact-po/CustomerServer.java:26-46 | customer_service.sql:1-17 DROP+CREATE；tenant_id varchar(64)、category、server_id、server_name 等，只有主键。与 User tenant_id int 类型不同，不能默认数字/字符串归属含义完全一致。|

`t_contact` 没有 platform_code。已搜索上述相关仓库 SQL/Java 和补充仓库 SQL/文档，未发现 platform_code/platformCode 的数据库迁移；若发版要求包含“平台代码”，目前没有可直接采用的新增/历史值映射证据，需核实真实字段名及配置来源，不应凭空添加字段或把 tenant_id 默认 0 视为已经完成业务归属回填。

## Agent/Gateway 持久化：区分目标和当前运行

- `sparrow-agent/agent-po/src/main/java/com/sparrow/agent/po/ConversationMessage.java:27-85` 定义 t_cs_message（id/message_id、session_id 二进制排序、conversation_id、event_type、message_type、sender_type/id、content、original_client_send_time、reply/duplicate 引用、create_user_id/gmt_create）。唯一索引草稿在 `doc/req-r02-websocket-realtime/sql/message-indexes.sql:1-17`；首行明确“设计稿、不是已发布 Flyway 迁移”。两组 UNIQUE：session_id+message_id（8-9），session_id+conversation_id+sender_id+sender_type+original_client_send_time（12-14）。无 CREATE TABLE，无已接入版本迁移。
- `sparrow-agent/agent-dao-mybatis/` 实际只有 pom.xml，没有 Mapper/DAO 实现。ConversationMessageDao 和领域 Repository 存在，但 infrastructure 未找到实现或使用。当前 `agent-infrastructure/.../subscriber/ConsultMessageSubscriber.java:72-100` 是 ChatClient 调用后直接发布，ResponseConsultMessageSubscriber.java:43-49 直接向连接发送，未落库。因此不能把“建 t_cs_message”写成当前实时演示启动必须操作；应写可靠历史/幂等持久化尚未落地，若以这些能力作为上线承诺则缺实现与迁移。
- `sparrow-messaging-gateway/messaging-po/src/main/java/com/sparrow/messaging/po/SessionMessageSeed.java:40-68` 定义 t_messaging_seed：seed_key varchar64 二进制比较自然主键，last_synced_message_id unsigned bigint default0，gmt_create、gmt_create_user_id、gmt_modified。只有 DAO 接口及 `messaging-dao-sparrow/.../SessionMessageSeedDaoImpl.java:27` 空 ORMStrategy 绑定。未发现其他生产代码消费该 DAO/种子，也无 SQL。MessageConfiguration.java:40-104 装配发布订阅和连接，没有种子恢复链。因此是未实现的持久化设计，不可称现有完整领号恢复能力。
- 旧 Agent 索引草稿仍提 t_cs_message_seed/session_id 主键（16），已与 Gateway 实体 t_messaging_seed/seed_key 分离；Agent technical.md:521 明确旧种子设计不可据此实施。不要创建两套种子表。

## Security/其他仓库

- `sparrow-security/release.sh:11` 明确“DROP并重建13张表，仅用于首次上线/清库初始化”；实际导入 `sparrow-security-release.sql`，22-294 为13张 DROP+CREATE，302-337 带示例组织/人员/角色/权限/字典等数据。不能作为已有生产库升级脚本。该仓新增 t_organization、t_position、t_admin_user、t_app、t_micro_service、t_permission、t_role、t_user_group、t_user_group_member、t_dict_type/type_i18n、t_dict_item/item_i18n。
- ddl/*.sql 也是 DROP 初始化；例如 t_user_group_member.sql:4-7 tenant_id/group_id/member_type/member_id NOT NULL，业务关联无外键、无联合唯一约束；各表只有主键，不能把代码里查重当作数据库唯一约束。
- 旧 security-po/bin/ddl 与新 ddl/release 同时存在，不可混跑。用户组成员从旧关系到 member_type=1用户/2部门/3岗位的映射、组织父子关系/租户归属、国际化 locale 历史转换均没有看到独立增量回填脚本。
- sparrow-starter 无 SQL 迁移记录；sparrow-integration 最后 SQL commit 2022-08-14 55842b9，本地删除旧 sparrow-user/user.sql 等，属于旧模块迁出/删除，不能当作生产删用户表指令。本次无新增未跟踪 SQL 文件（检查相关仓库 status --short -- '*.sql'）。

## 可证实历史

- chat 最近 SQL commit 09d1f05 2026-09-09 只改 contact.sql 一个空格，非新业务结构。20250421/23/30 三文件现路径最近 commit deaa790 2025-09-09（路径重构），文件名不能代表生产执行日期；较早相关 SQL commit 74bc836 2025-05-12、5781315 2025-05-06、6b542fd 2025-05-01 等。缺生产发版起点，不能把任意一个历史 commit 判为本次必执行起点。
- Passport 最近 SQL commit 5cb58d4 2026-10-12 是格式改写，根 user.sql 结构仍是旧模型；host 等早在 bcd8001 2025-08-21 的实体历史中已存在，不能误报为10月新加但更不能假定生产已迁移。
- Security c059893 2026-10-09 新增 release.sql/release.sh，前序 2026-10-03~09 连续重建结构；没有安全增量链。
- Agent 索引草稿历史为 808ca6e 2026-10-14、6459625 2026-10-15、86dc726 2026-10-24；Gateway 初始模块 e96a412 2026-10-25。只有定义不代表已经部署或执行。

## 推荐执行顺序（方案，非可执行上线指令）

1. 锁定实际发布 commit/未提交内容与生产旧版本，导出受影响表结构、行数、索引及备份恢复点；确认 user/t_user 是否同库同源，各服务 DAO 实现。
2. 先把生产现状与字段清单对照；只生成缺少的扩展列/新表迁移，禁止套用 DROP 初始化。若还需要旧表改名，统一切换写入方和读取方并预查新旧同名表是否并存。
3. 对用户/会话历史数据做预查与转换演练，先扩展兼容列、回填、核对数量/关联，再收紧类型/NOT NULL/唯一索引；不能将 timestamp 直接改 bigint 视作 epoch 毫秒已正确转换。
4. chat 当前上线字段必须处理 t_message.device_type 与 t_user.host 等实际差异；保留现有用户/联系人/群/消息 ID，核对 session_key 与双方类别，不重发历史ID。
5. 只有持久化实现纳入已批准上线范围后，才创建正确的 t_cs_message 与 t_messaging_seed 并加经过重复检查的索引；不建立旧 t_cs_message_seed。
6. 数据库向后兼容扩展完成并核对后，再切应用；保留旧列/数据与备份到回退窗口结束。上线后检查实际注册、联系人读取、消息写入、会话同步。安全清库脚本只适合经明确确认的空库初始化。

## 必须预查数据

- 用户：主键范围；user/t_user 同时存在与数量差异；用户名/邮箱按目标排序规则重复、空串及 NULL（空串若加唯一只能留一条）；长度超限（用户名、密码存储长度、手机13→11、channel500→128、device255→16等）；status 旧字符串语义；ip 旧文本是否 IPv6/非数字；各 timestamp 时区和 epoch 毫秒转换、NULL策略；tenant/category/host 真实归属与空默认意义。
- 关联：t_contact user_id/friend_id、qun owner/member、session user_id、session_meta 双方、customer_service.server_id 是否对应同一套用户ID；是否存在跨租户关系；不能只验证非空。
- 会话：varchar user_id 的游客/非数字/负数/超 unsigned-int 值；修改 user_id 类型是否导致丢失访客；session_key 64长度是否足够；状态/同步时间默认值是否会导致全量历史重复同步或漏读。
- 索引：t_cs_message 两组组合键重复/NULL、utf8mb4_bin 大小写区别、sender_id=0 是否仅系统AI、message_id/conversation_id 超 Java long 范围；种子恢复值是否大于已分配历史最大值，不能仅设0后重复发号。
- Security：tenant=0 是否真正全局；组织树断链/环、权限层级、角色/用户组归属、member_type对应实体存在性、locale旧数值与语言代码转换。初始化样例数据不能代替生产配置。

## 回退限制

DROP/重建会清历史数据，只能从备份恢复；rename 需协调所有应用版本；收缩长度、timestamp→整数、文本IP→整数、字符串用户ID→unsigned-int、status语义转换若覆盖原值，不能只靠逆向 ALTER 恢复。加NOT NULL/唯一约束会因历史脏数据失败；唯一索引建立前若删/合并重复数据，须独立留存映射和原值。DDL有部分执行/自动提交风险，现有 BEGIN/COMMIT不能被当成整包可回滚保证。恢复旧应用时应优先保留新增兼容字段/新表，避免下线后直接删列；上线后新增用户/消息不能通过恢复整库快照无损保留，需明确增量重放/停写与对账办法。未发现配套 down/rollback SQL 或可验证恢复演练记录。
