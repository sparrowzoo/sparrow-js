# 菜单注册与跨站同步

## 已确认范围

用户已确认执行：共享 MenuRegistry 保留并提供 register；id 使用 string；翻译函数使用 `(key: string) => string`；Header 原有参数和功能保持；Sparrow 菜单唯一维护于 common/src/sparrow；指定站点通过统一脚本同步。

## 实现职责

- [MenuRegistry](../../common/src/common/lib/MenuRegistry.ts)：实例隔离、整组注册、重复编号检查、入口选择、语言替换、翻译及展示属性透传。
- [共享 Header](../../common/src/common/components/header/header.tsx)：增加 menuRegistry 和可选 translator，保留原有默认值与展示；不固定读取 product 消息空间。
- [Sparrow 菜单](../../common/src/sparrow/menu.ts)：业务地址、菜单顺序、可用性与入口的唯一源；主站产品页复用同一配置。
- [Sparrow Header](../../common/src/sparrow/header.tsx)：客户端内注入实例与翻译，不把不可序列化的参数从服务端布局传入。
- [复制脚本](../../common/copy-shared.mjs)：集中维护目标白名单，默认一次分发全部六站并逐文件核对；子站点不再维护复制入口。admin/coder/chat/passport 均接收 common 和 sparrow，凌卓仅 common。

## 兼容与限制

主站、文章辅助页、thymeleaf 页面、chat、passport 只切换页头导入；原 Header 调用参数保留。主站三处产品相关文件改用 sparrowMenus。
admin/coder 继续使用独立后台页头。SiteBanner、登录、主题、语言切换逻辑不改。
register 在渲染前执行，不提供响应式订阅；运行时菜单变化由上游创建新实例再渲染。Sparrow 静态实例仅初始化注册一次，不写入请求语言或用户状态。
复制会覆盖明确的共享目录同名文件，但不删除其他文件；不执行部署或提交。同步脚本由 Node 内置文件 API 完成，不增加依赖。

## 实施与验证

1. 注册器和 Header 接口调整，统一业务配置及全部实际调用迁移。
2. 集中复制脚本和入口；同步四个 Sparrow 站点及两个凌卓目标。
3. 测试注册替换、重复编号、实例隔离、入口过滤、翻译、语言与输入防修改；验证 Header 不读取 product。
4. 验证复制范围与路径、对比源副本，构建主站、chat、passport。

## 评审结论

方案及执行范围已获用户确认。实施与验证结果见 evidence.md；本轮不含提交、推送或发布。
