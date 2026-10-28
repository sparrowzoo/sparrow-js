# Java 协议对齐实施计划

目标：以用户提供的 Protocol 及本地 messaging-protocol Java 源码为依据，替换聊天客户端旧协议。

用户已确认：删除旧 ImProtocol；移除 version、使用 device；事件编号和结束段以 Java 为准；单聊按 ID 字符串排序，相同时按真实类别排序；其他编解码规则对齐 Java。已明确授权实施，不重复申请方案确认。

## 接口及范围

- `Protocol.fromBytes(frame: ArrayBuffer | ArrayBufferView): Protocol` 解析有效视图，保持输入不变；`toBytes(): Uint8Array` 返回完整帧。
- 保留聊天创建方法，默认设备 PC=1；正文为 `string | null`；messageType 使用无符号 0–65535 表达两字节；时间使用非负安全整数，超范围拒绝以防精度丢失。
- 事件按 Java 的 EVENT=0 / CONTENT=20 / TIME=30 / USER=40 结束段读取和校验。ERROR=-99 以有符号事件字节解码。按 Java 现状允许结束段之后的剩余字节。
- 用户、会话与 Protocol setter / clone / ack / pong 行为对齐；单聊 ID 为 1–99 个 UTF-16 单元，类别 0–9；用户 ID 与群 key 最多 255 个 UTF-8 字节。
- MessageBroker 仅将 IM/AI 完整帧转为聊天消息，其余事件经控制回调传递；PONG 更新心跳、PING 回复 PONG、OFFLINE 调用现有离线通知。
- 共享 WebSocket 增加可配置的心跳和状态发送入口，由聊天端配置二进制协议，其他调用方保留默认行为。鉴权文本消息沿用已有格式。

## 执行与检查

- [x] T1：添加固定字节、分段、视图偏移、截断及边界测试，先运行确认旧实现失败。
- [x] T2：重写 Protocol 与枚举；对齐 ChatUser / ChatSession，删除 ImProtocol.js。
- [x] T3：接收与心跳入口已修正，AUTH_BIND、5 秒二进制心跳、关闭定时器清理及超时回归通过；真实正常登录会话 PING/PONG 持续往返。
- [ ] T4：63 项协议测试、5 项共享回归、类型检查和真实心跳复验通过；业务消息因后台缺少 IM/0 处理器被拒绝，完整收发验收待后台支持后继续。不提交、不推送、不部署。

重点检查：ERROR 负编号、messageType=65535、多字节 ID 与群 key、相同 ID 不同类别、ACK 无用户段、空正文、缺失时间、超出安全整数范围、二进制心跳。

## 评审结论

用户已指定正常登录页并完成登录，之后明确授权修正 SparrowWebSocket 的 PING/PONG。已完成 AUTH_BIND、聊天端 5 秒二进制心跳和定时器清理修正，自动测试、类型检查及真实浏览器持续心跳复验通过。正常登录和联系人/会话页面可以加载；历史内部测试登录错误不作为当前正常登录的阻断。

T3 完成，T4 的业务收发仍未通过：后台拒绝 IM/0，日志为 No handler for message type 0, event type IM，未收到 ACK。该后台处理器不在本轮前端修正范围内；详见 evidence.md。未提交、未发布。
