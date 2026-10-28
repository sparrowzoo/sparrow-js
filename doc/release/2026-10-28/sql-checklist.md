# 2026-10-28 SQL 上线核对表

未连接生产库，以下是代码与脚本差异，不代表生产一定缺列。迁移实施前须取得实际表结构、已执行记录及可恢复备份；当前不提供整库可直接执行迁移。

| 对象 | 本次证据 | 操作要求 |
| --- | --- | --- |
| t_message.device_type | 本地新增PO字段；MessageConverter赋值，Repository实际插入；现有SQL未添加 | 核对列是否存在；缺失时补扩展列，演练DDL锁表影响。 |
| t_user.host | 旧有实体及注册代码使用，SQL未覆盖；不是本次新加 | 查实际生产结构；只有缺失才补，不重复ADD。 |
| t_user.tenant_id | 旧20250430.sql已有ADD，允许NULL；实体为NOT NULL/default0 | 查空值和归属，确定回填后才考虑收紧；不盲设所有租户0。 |
| 用户表名 | 20250421.sql已有user→t_user；Passport旧MyBatis示例仍用user | 核对实际发布的DAO及现存表，不能全库机械改名。 |
| t_session | 历史脚本改user_id类型、加sync_time/status | 核对是否已执行，检查varchar→整数历史值及有符号范围。 |
| t_session_meta | 20250430.sql开头DROP+CREATE | 已有库不得直接重跑，否则丢元数据。 |
| 用户category | 新枚举AI=2/客服=3；旧生产前端仍使用旧分类 | 对照真实用户、联系人、token和sessionKey制定映射，不只是修改显示配置。 |
| Security表 | release.sh/release.sql为13表清库初始化，带示例数据 | 已有库不得执行；若同步发布新管理功能，另按实际旧结构形成定向迁移。 |
| Agent/Gateway设计表 | t_cs_message和t_messaging_seed尚无实际持久化调用链 | 不作为当前问答启动前必建表；不能承诺持久历史、幂等与重启恢复。 |

明确脚本错误：sparrow-chat/sparrow-chat-boot/release-node/20250430.sql第25行缺分号，后接ALTER t_user。即使修分号也不能使含DROP的整个文件变成安全生产升级脚本。

只读预查示例（在明确目标库后，由获准的数据库操作方执行；本轮未执行）：

```sql
SELECT TABLE_NAME, COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('user','t_user','message','t_message','t_contact','t_session','t_session_meta')
ORDER BY TABLE_NAME, ORDINAL_POSITION;
SHOW CREATE TABLE t_user;
SHOW CREATE TABLE t_message;
SELECT COUNT(*) AS null_tenant_count FROM t_user WHERE tenant_id IS NULL;
SELECT category, COUNT(*) AS user_count FROM t_user GROUP BY category;
```

只有确认t_message存在且device_type列不存在时，新增列候选：

```sql
ALTER TABLE t_message
  ADD COLUMN device_type INT NOT NULL DEFAULT 0 COMMENT '设备类型';
```

默认0并不恢复历史设备数据。执行前固定备份、DDL锁表方案、前后记录量和抽样验收；回退应用通常保留兼容新增列，不删列/不重建整表、不用旧备份覆盖新业务数据。完整字段与源文件行号见sql-audit.md。
