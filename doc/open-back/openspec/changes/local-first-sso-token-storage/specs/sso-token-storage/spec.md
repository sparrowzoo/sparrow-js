## Purpose

为同一浏览器中的认证站与应用站提供可配置、可诊断的登录凭证读取能力，保留既有存储方式并增加可由前端读取的 Cookie。该能力明确本地优先、远端结果不复制、跨子域共享范围及存储失败语义，避免将存储可见性与后端鉴权有效性混为一谈。

本能力的新凭证行为在凭证版本 2 激活后适用；版本 1 的兼容准备行为受 `sso-release-validation` 中的版本切换要求约束。

## ADDED Requirements

### Requirement: 可配置的三种存储模式

系统 SHALL 支持 LOCAL、SESSION、COOKIE 三种登录凭证存储模式；未配置模式时 SHALL 使用 LOCAL。调用方显式选择的模式 MUST 优先于默认配置，AUTOMATIC SHALL 使用默认配置；非空但不属于允许值的配置 MUST 明确失败，不得静默切换为其他模式。

#### Scenario: 未配置存储模式
- **WHEN** 调用方未显式选择模式且环境未配置默认模式
- **THEN** 系统使用 LOCAL，并保留既有接口的调用方式

#### Scenario: 显式模式覆盖默认配置
- **WHEN** 默认配置为 COOKIE 且调用方显式指定 LOCAL 或 SESSION
- **THEN** 本次读取、写入和删除按照显式模式执行，不因默认配置改用 Cookie

#### Scenario: 配置值无效
- **WHEN** 配置去除首尾空白后仍不是 LOCAL、SESSION、COOKIE 中的一个值
- **THEN** 存储操作返回可识别的配置错误，不读取其他模式作为替代

### Requirement: 本地优先的登录凭证读取

凭证版本 2 激活后，系统的 getToken 接口 SHALL 先读取当前应用站 B 在所选模式下可见的真实登录凭证，仅在该凭证明确缺失时向认证站 A 请求。存在本地候选凭证时 MUST 不创建或访问存储代理 iframe；认证站 A 本身无本地凭证时 MUST 直接返回缺失，不向自身重复代理请求。

#### Scenario: 本地读取命中
- **WHEN** B 的所选存储存在可用的登录凭证
- **THEN** 系统使用该本地来源，不创建 iframe，也不向 A 发送读取请求

#### Scenario: 本地为空后读取认证站
- **WHEN** B 的本地读取成功但未找到登录凭证
- **THEN** 系统才尝试向 A 读取同一模式及当前凭证命名空间，并保留该结果的认证来源

#### Scenario: 本地命中但代理不可用
- **WHEN** B 已有可用本地凭证，而代理地址未配置、不可达或无法就绪
- **THEN** 本次本地读取仍可完成，不以代理可用性作为本地命中的前置条件

#### Scenario: 认证站自身没有凭证
- **WHEN** A 上的调用未找到本地登录凭证
- **THEN** 系统返回明确缺失，不创建指向自身的循环读取链路

### Requirement: RPC 读取结果不形成应用站副本

系统 MUST 只将 RPC 返回的 token 提供给本次调用，不写入 B 的 LOCAL、SESSION、COOKIE 或其他持久存储，也不保留供后续独立调用复用的内存 token 缓存。系统 SHALL 允许合并同时进行的相同读取，但该批调用完成后后续调用 MUST 重新读取；此规则适用于 RPC 返回的任何 token。

#### Scenario: 远端 token 读取成功
- **WHEN** B 本地无凭证且 A 返回 token
- **THEN** 调用方获得该 token，B 的持久存储中不新增其副本

#### Scenario: 后续独立调用
- **WHEN** 前一次 RPC 已完成且 B 仍没有本地登录凭证
- **THEN** 后续 getToken 再次读取 A，不复用前一次返回的 token

#### Scenario: 同时发起读取
- **WHEN** 多个调用同时等待同一来源的读取结果
- **THEN** 系统可以共享这次未完成的读取，但完成后不将结果转化为可长期复用的登录缓存

### Requirement: 缺失与失败必须区分

系统 SHALL 将成功读取后的空值与配置错误、存储访问错误、代理超时或无效响应区分。只有成功读取后得到的空值 SHALL 作为缺失；已知过期或损坏的本地凭证 MUST 不通过寻找另一份旧凭证掩盖。系统 MUST 不声称能够仅凭跨根域 Cookie 的空读取区分未登录与浏览器静默隐藏存储。

#### Scenario: 本地存储拒绝访问
- **WHEN** B 的本地存储读取发生访问错误
- **THEN** 本次调用失败，不把该错误当作本地缺失而继续寻找其他来源

#### Scenario: 代理请求超时或响应不合法
- **WHEN** 本地无值后的代理读取超时或收到无法接受的响应
- **THEN** 本次调用返回可识别错误，不转换为正常 null，也不自动降级存储模式

#### Scenario: 本地凭证损坏或已知过期
- **WHEN** 本地候选凭证不能被有效解析或已经达到业务截止时间
- **THEN** 系统将该凭证视为不可用并要求重新登录，不回退到另一份身份凭证

#### Scenario: 不同根域代理返回空值
- **WHEN** 跨根域代理成功响应空值但无法确定浏览器是否隐藏了 Cookie
- **THEN** 系统保留真实空读取结果，并且不将其诊断为已经证实的认证站退出事件

### Requirement: Cookie 共享范围与属性

COOKIE 模式 SHALL 使用 JS 可读 Cookie，支持明确配置的 Domain、SameSite 和 Secure，Path SHALL 为 `/`；Domain 未配置时 SHALL 为 host-only。系统 MUST 不自动猜测共同父域，不接受非法域、公共后缀或不合法属性组合。生产 Cookie MUST 使用 Secure；SameSite=None MUST 同时使用 Secure。

#### Scenario: 同根域 HTTPS 子域共享
- **WHEN** 同一浏览器中的 A 与 B 位于同一根域下的 HTTPS 子域，且 Cookie 使用覆盖这些子域的合法共同 Domain 和相同名称及 Path
- **THEN** A 登录后 B 可以在本地读取同一份共享 Cookie，跨子域 SSO 不依赖 iframe 读取

#### Scenario: 未配置 Domain
- **WHEN** Cookie 配置没有 Domain
- **THEN** 新 Cookie 只属于写入主机，不宣称它可以由其他子域直接读取

#### Scenario: 写入域或属性组合不合法
- **WHEN** 权威写入站被配置为写入不匹配的域、公共后缀，或使用缺少 Secure 的 SameSite=None
- **THEN** 写入明确失败，不改写到其他域或其他存储来制造登录成功

#### Scenario: 不同根域的应用站读取
- **WHEN** B 与 A 属于不同根域且 B 本地没有可见 Cookie
- **THEN** B 可以继续尝试代理读取，但不尝试在 B 写入属于 A 域的 Cookie，也不承诺该代理读取必然成功

### Requirement: Cookie 内容完整性与歧义处理

系统 SHALL 精确匹配 Cookie 名称并保持 token 内容往返一致，避免特殊字符、等号或编码造成凭证变更。多个同名可见 Cookie MUST 返回歧义错误；完整赋值内容超过 4096 个 UTF-8 字节时 MUST 在写入前拒绝，不截断 token。

#### Scenario: 特殊字符与已有编码往返
- **WHEN** token 含有等号、百分号、已有转义文本或其他需要编码的字符
- **THEN** 成功写入后读出的 token 与输入完全一致，不发生额外解码或截断

#### Scenario: 名称前缀相同
- **WHEN** 存在多个名称具有相同前缀但完整名称不同的 Cookie
- **THEN** 读取只返回目标完整名称对应的值

#### Scenario: 可见同名 Cookie 重复
- **WHEN** 浏览器暴露多个目标同名 Cookie
- **THEN** 系统返回歧义错误，不按出现顺序任选一个，即使它们的值相同

#### Scenario: Cookie 超过应用容量上限
- **WHEN** 完整赋值内容超过 4096 个 UTF-8 字节
- **THEN** 系统在写入前报告容量错误，原凭证不被截断或替换为不完整内容

### Requirement: 写入与删除具有可确认结果

系统 SHALL 验证 Cookie 写入后的可见值以及删除后的可见缺失。写入或删除被浏览器拒绝时 MUST 明确失败，不显示保存成功；删除 SHALL 使用与目标凭证一致的名称、Domain 和 Path。值读回验证 MUST 不被宣称为已验证 Cookie 的有效期或共享属性。

#### Scenario: 浏览器静默拒绝写入
- **WHEN** 浏览器未抛出异常但写入后无法读到预期的新值
- **THEN** 系统报告保存失败，不进入登录成功回跳流程

#### Scenario: 删除后仍有可见凭证
- **WHEN** 按目标范围删除后仍能读取目标 Cookie
- **THEN** 系统报告存储清理失败，不声称该 Cookie 已清除

#### Scenario: 删除已经缺失的凭证
- **WHEN** 目标凭证已不存在且未发现其他同名残留
- **THEN** 存储删除作为幂等操作完成

### Requirement: 显式登录写入保持认证站归属

显式登录的凭证写入 SHALL 保持认证站 A 为写入归属：在 A 发起时写入其所选本地存储，在应用站 B 发起时写入 A 的对应存储。系统 MUST 不因读取改为本地优先而将 B 登录写入改成新增 B 私有 token 副本；写入失败 MUST 不向其他位置保存作为替代。

#### Scenario: 在认证站完成登录
- **WHEN** 用户在 A 完成登录并保存新的登录凭证
- **THEN** 凭证写入 A 的所选存储，使用该模式对应的有效保存策略

#### Scenario: 在应用站完成登录
- **WHEN** B 发起显式登录并保存后端返回的登录凭证
- **THEN** 凭证写入 A 的对应存储，B 不因本地优先读取规则而另建私有登录副本

#### Scenario: 应用站无法完成认证站写入
- **WHEN** B 发起的显式登录凭证无法在 A 保存或确认保存成功
- **THEN** 本次写入明确失败，不在 B 建立备用 token，也不假报保存成功

#### Scenario: 新登录不能被 B 的独立旧身份遮蔽
- **WHEN** B 已存在独立本地登录凭证，并在 A 成功保存了新登录身份
- **THEN** 系统按操作开始时的旧凭证快照清理 B 的独立旧值，不在 B 保存新 token；清理失败不报告身份切换成功

#### Scenario: 显式登录更新共享 Cookie
- **WHEN** A 的新登录已替换 A 与 B 共同读取的同一 Domain Cookie
- **THEN** 系统不把该共享新凭证当作 B 的独立旧副本删除，且确认读取没有同名歧义后才报告保存成功

### Requirement: 兼容的异步接口与鉴权传输

系统 SHALL 保留现有 token 接口的默认参数和显式存储选择方式，成功读取返回 token 或 null，成功写入返回写入值，成功删除返回删除前值或 null；操作失败 MUST 通过 Promise rejection 返回。COOKIE SHALL 只改变存储位置，不改变现有 Authorization 原 token 字符串、上传凭证或 WebSocket 握手 token 的传输约定。

#### Scenario: 现有 LOCAL 或 SESSION 调用
- **WHEN** 调用方使用原有参数形式调用读取、写入或删除接口
- **THEN** 系统保留对应返回值约定，不要求调用方改用 Cookie 鉴权

#### Scenario: 同源与代理错误
- **WHEN** 同源存储或代理存储发生操作错误
- **THEN** 调用方均通过异步拒绝处理错误，不需要区分同步抛出与异步失败

#### Scenario: COOKIE 模式发送受保护请求
- **WHEN** HTTP、上传或 WebSocket 消费者取得可用 Cookie token
- **THEN** 它们继续使用既有 token 鉴权协议，不因启用 COOKIE 自动切换为仅依赖请求 Cookie 的鉴权

### Requirement: 可验证的 RPC 对端与能力

系统 MUST 只接受来自指定窗口和精确受信 origin 的消息，并关联对应请求及合法响应结构。认证站 SHALL 声明支持的存储和条件更新能力；COOKIE 或条件更新请求 MUST 在对端能力不足时明确失败。认证站的代理操作 SHALL 只访问被允许的当前凭证或诊断范围，不递归调用另一层代理。

#### Scenario: 非预期窗口或 origin 发送消息
- **WHEN** 消息来自非白名单 origin、非预期窗口或使用不匹配的请求标识
- **THEN** 系统不接受该消息作为有效请求、就绪声明或操作结果

#### Scenario: 老代理不支持 Cookie
- **WHEN** 调用需要 COOKIE 或条件更新，而认证站未声明相应能力
- **THEN** 系统返回不支持错误，不静默改用 LOCAL，也不把不支持表现为正常空值

#### Scenario: 访问未允许的存储 key
- **WHEN** RPC 请求试图操作当前凭证、访客或显式诊断范围以外的 key
- **THEN** 认证站不返回或修改该存储内容

#### Scenario: 代理未就绪或调用被取消
- **WHEN** 请求等待代理就绪及响应的总时间达到 10 秒，或其身份操作已被退出及销毁取消
- **THEN** 请求在有界时间内以超时或取消结束，不无限等待，也不在结束后接受迟到结果
