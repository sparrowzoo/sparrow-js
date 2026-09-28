# SSO Cookie 与本地优先读取 · 全链路证据

<a id="scope"></a>
## 本轮范围与来源

- 需求：`req-r01-sso-token-storage`；TRD：`TRD-req-r01-sso-token-storage`；迭代：`01`；模式：`lite`。
- 日期：2026-09-28。项目位置以 `${user.home}/workspace/sparrow/sparrow-js` 表示。
- 本轮授权：U11 确认六步代码落地；U13 进一步授权总结、提交、push 并合并至 master。生产部署不在授权范围。
- 本需求依据本次用户确认及当前代码调查编写。功能定义、接口和场景完整保存在本目录，阅读与执行不需要其他需求文档。
- 当前规则与实现范围见 [TRD](technical.md#trd)，任务状态见 [plan.yaml](plan.yaml)。

<a id="baseline"></a>
## 代码调查依据

代码调查时 Git HEAD 为 `60fbbc200530d81fa564d34b2acb3fb2ff42a828`，实际核对的是当时工作树中的源码。具体文件与当前行为记录于下方“调查与分流”；该提交号不代表本轮文档已提交或功能已实施。

用户确认的必要原文摘录保存在本文件，技术事实引用项目源码；不把目录外的需求文档作为设计或验收依据。

<a id="confirmations"></a>
## 用户确认依据

原始来源为本次对话，无可公开会话链接；保留 2026-09-28 的范围与必要摘录，供团队复核。不伪造工单号或确认链接。

| 记录 | 原始确认摘录 / 上下文 | 结果 |
|---|---|---|
| U01 | “token 生成后保持不变”“续期的截止时间可配置 这里可以不关心” | token 按不透明字符串处理；后端业务续期策略不纳入前端改造。 |
| U02 | “只保证前端失效即可，后端延迟失效 不影响用户体验” | 本轮退出与失效处理限定前端凭证和对应展示状态，不新增服务端即时撤销接入。 |
| U03 | “子域可以直接读cookie” | 共享父域 Cookie 是明确选择，不以 RPC 白名单限制同父域的直接读取。 |
| U04 | “想多了 一般客户端不会并发写token” | 不建设 CAS、epoch、跨标签写事务或实时广播机制。 |
| U05 | “先读本地再RPC读iframe”“如果跨根域 可能需要上线验证 这个是个风险点 但影响不大” | 同根域作为必须验收项；跨根域按已有 RPC 尝试并记录实际结果，不作全浏览器成功承诺。 |
| U06 | “在这额外保留时间内 前端getToken 正常读即可 是否真实有效后端确定” | 读取不解析业务有效期、不改 token、不自动延长 Cookie，由后端判定有效性。 |
| U07 | “如果读不到 物理过期时间已到 重新登录” | 本地无值仍先 RPC；两处确无凭证才进入既有未登录/允许访客流程。读取异常不能伪装成不存在。 |
| U08 | 前序已确认：勾选保存配置天数、默认 14 天；物理保留额外 1 天；未勾选会话 Cookie；RPC 结果不回写 B；升级重新登录 | 复用已有决定，不重复询问；前端 Cookie 保存配置不替代后端业务有效期。 |
| U09 | 在说明下一步为 lite TRD＋PLAN 后，用户要求“继续走下边的流程” | 开始本轮文档规划；尚未进入业务实施。 |
| U10 | 用户说明已有 doc 文档将移除，要求新 TRD 不引用 | 当前需求文档自包含；保留本目录内引用、用户确认和代码依据，不依赖目录外的需求文档。 |
| U11 | “存储基础…可以直接执行，单独维护一个类”；“RPC单独抽出来…监控逻辑抽离”；“CRUD都需要统一封装”；“5同意6同意” | 确认 StorageManager 策略 CRUD、RPC/监控拆分、本地优先、登录退出、四站同步与验证；开始实施。 |
| U12 | “npm 安装比较慢 请使用yarn 记住这个规则” | 安装统一使用 Yarn，记录于项目 AGENTS.md；本轮依赖与脚本命令同步调整。 |
| U13 | “总结 提交&push 合并至master” | 授权提交本次 SSO 变更、推送并合并 master；T06 真机未验收状态保留，不等于生产部署。 |

<a id="investigation"></a>
## 调查与分流

- **上下文：** 核对前端共享源及 Passport/IM 调用链；先只读分析，再按用户澄清收敛范围。
- **输入：** U01—U10；[CrosStorage](../../common/src/common/lib/CrosStorage.ts)、[协议](../../common/src/common/lib/protocol/CrosProtocol.ts)、[LoginUser](../../common/src/common/lib/protocol/LoginUser.ts)、[环境配置](../../common/src/common/lib/Env.ts)、[Common scripts](../../common/package.json)、[Passport scripts](../../react-next-passport/package.json)。
- **输出：** [TRD 的分流与代码影响](technical.md#impact)。
- **结果：** 本轮意图集中于存储/读取与前端状态，采用 lite；改变现有共享调用路径，属于存量改动。复杂度不按四站数量或文件数量判断。
- **调查时事实：** `CrosStorage` 构造函数跨源即建 iframe，`getToken()` 直接调用既有 `get()`；协议只有 LOCAL/SESSION/AUTOMATIC。调查时 `LoginUser.logout()` 删除凭证和用户缓存；未发现所查前端链路触发后端撤销，本轮按 U02 不为此新增接入。

## 需求、产品、技术与计划

- **上下文：** lite 模式将需求与产品规则合并于 TRD，不声称运行独立 REQ/PRD 阶段。主执行者归并 `plan.yaml`、本文件和生成视图；子审查者只读回传建议。
- **输入：** 上述代码调查依据、用户最新确认、现有函数和调用方，以及共享 `develop-work-flow`/`trd-writer` 规范。
- **输出：** [technical.md](technical.md)、[plan.yaml](plan.yaml)、生成的 [plan.md](plan.md)。
- **规划结果：** 形成自包含设计及六项任务。测试入口随后在实施阶段建立；规划本身不作为业务通过证据。
- **证据位置：** [场景](technical.md#acceptance)、[测试设计](technical.md#test-strategy)；结构与生成检查的实际结果记录于下方“规划验证”。

<a id="scope-decisions"></a>
## 本轮范围确认

本轮任务为 T01—T06，完整范围、依赖与验证入口由 [plan.yaml](plan.yaml) 维护，按实际结果推进。规划检查不作为业务 GREEN。

依据 U01/U02/U04/U06，本轮不建设前端续期、新 token claims、CAS/epoch、即时后端撤销接入或自动版本发布系统；保留既有消费者与访客行为，不引入独立访客缓存。这些范围边界已完整写入 [TRD](technical.md#impact)，不是隐含后续任务。未来扩大范围时，在同一需求目录另起迭代并确认变化部分。

<a id="planning-checks"></a>
## 规划验证与审查

本节记录实施前实际完成的文档检查；业务测试记录见下方实施章节。

### 结构、生成与引用检查 · 2026-09-28

- **上下文：** 仅检查本轮 lite 文档，不执行任务中的业务命令。
- **输入：** technical.md、plan.yaml；Node.js v22.16.0，用户级工作流依赖已可加载，未重复安装。
- **输出：** 自动生成 plan.md，全部 6 项业务任务为 todo。
- **结果：** 下列命令返回码均为 0；修正审查问题后已重跑。结构检查不证明业务功能已实现或测试通过。
- **证据位置：** 本节保留实际命令与摘要；生成视图的 `sources-sha256` 可由 check 复核。

```sh
node .agents/skills/develop-work-flow/scripts/workflow.mjs validate --project . --feature req-r01-sso-token-storage
# OK validate req-r01-sso-token-storage: 6 tasks；仅结构/引用校验，未执行命令。
node .agents/skills/develop-work-flow/scripts/workflow.mjs render --project . --feature req-r01-sso-token-storage
# OK render doc/req-r01-sso-token-storage/plan.md
node .agents/skills/develop-work-flow/scripts/workflow.mjs check --project . --feature req-r01-sso-token-storage
# OK check req-r01-sso-token-storage: 生成内容与全部源文件一致。
```

另以路径/显式锚点扫描逐项核对本地 Markdown 引用，无断链；新文档未出现个人绝对路径。

### 独立设计审查 · 2026-09-28

- **上下文：** 认证存储涉及存量行为，使用两位只读子审查者核对实际设计，不绑定模型。
- **输入：** 本轮三份编写源、用户最新规则、Passport 别名配置及既有共享复制机制。
- **输出：** `review_lightweight_support` 发现 Passport 提前消费新接口但 copy 被安排到最后的顺序问题；`fresh_design_docs` 发现最终副本清单遗漏协议、LoginUser、hook 和 Header。
- **处理：** T02/T04 测试前同步 Passport；T02 在 Passport 自身 React/别名环境建立真实代理组件测试，Common 测客户端；T05 保留最终四站同步。任务文件清单补齐受影响生成副本。
- **结果：** 两项文档问题已修正，结构及生成检查重新通过；`review_lightweight_support` 已只读复核 T02/T04 的同步顺序、真实代理测试绑定及 T05 副本清单，结论为原问题已解决，修正范围未发现阻断或实际矛盾。没有新增业务范围或补造业务 GREEN。
- **证据位置：** [同步约定](technical.md#api-05)、[真实测试绑定](technical.md#test-strategy)、plan.yaml 的 T02/T04/T05。本节保存实际发现与修正内容，不依赖临时文件作为唯一记录。

### 文档自包含复核 · 2026-09-28

- **输入：** U10 与本目录的设计、任务和证据文件。
- **处理：** 完整保留当前规则与接口，将确认依据集中于本文件；移除对目录外需求文档的引用及依赖说明，重新生成阅读计划。
- **结果：** `fresh_design_docs` 只读复核确认 R01—R06、接口、S01—S14、测试与发布边界均已在 TRD 内说明，无需补取其他需求文档；validate、render、check 重新通过。
- **证据位置：** [TRD](technical.md#trd)、[范围确认](#scope-decisions) 及本节。此次仅调整本需求目录的文档，未删除其他文件、未改业务代码。

<a id="implementation"></a>
## 实施、测试与验收

本轮依据 U11 实施。下面区分实际行为测试、环境失败与未验证项；规划检查只证明结构一致。

### 实施启动与环境记录 · 2026-09-28

- **上下文/输入：** U11 的六步实施确认及策略/RPC/监控职责调整，当前 TRD 与计划。协调者唯一维护 DSL/本文件，三个子执行者分别负责存储、RPC/监控、代理/E2E。
- **分支：** 基线 `60fbbc200530d81fa564d34b2acb3fb2ff42a828`，实际工作区 `${user.home}/workspace/sparrow/sparrow-js`；切换到 `bug_req-r01-sso-token-storage`。该分支规则在实施途中重新加载时发现，首次修改发生在切换前，未伪称首次写入前已建分支。切换保留原工作树和暂存内容，未 reset/stash/提交。
- **环境：** 原 Common/Passport 的 node_modules 包含 root 所有文件，npm 安装 EACCES；将两目录完整移至本机临时备份，未删除原依赖。npm 后续依赖解析遇到 Arborist edgesOut 错误；这不是行为 RED。U12 后统一 Yarn。两份下载缓存造成磁盘不足后，仅清理本次 npm 缓存与重复的 Passport Yarn 缓存，保留原依赖备份，改用共享 Yarn 缓存顺序安装。
- **输出：** 统一策略实现；RPC/监控独立模块；facade 本地优先与保存/删除路由；对应测试源码。完整 Vitest、构建及浏览器验证尚待运行，不能据此标 done。
- **实际 RED：** 运行真实旧 CrosStorage 的边界断言，本地存在时实际返回 remote 而预期 local；旧 RPC 提前建 iframe、同 origin 错 source INIT 被接受、监控泄露原值；旧 LoginUser.logout 返回 undefined 而非可等待 Promise。旧普通/debug 代理接收错误 source、忽略 COOKIE、接受非法 remember，debug 含原凭证。上述使用 Node 原生 TS/TypeScript 转译及受控 DOM/React 边界桩，属于真实生产逻辑断言失败，不能代替浏览器/真实 React 测试。
- **范围复核：** 独立审查指出共享 Cookie 保存成功后 B 仍可能有同名 host-only Cookie；facade 已增加本地读回校验，歧义/无法确认时拒绝成功，不删除共享新 Cookie。

### T01–T05 · 行为与配置验证

- **T01 / R01 / S01–S03：** 真实策略注册存取与 Cookie 属性/编码测试；新增无 `=` 项的回归先出现 35 通过、1 失败，修复严格完整名称匹配后 Cookie 用例 36/36 通过。覆盖默认 LOCAL、显式模式、SSR、原字符串、14+1 天、会话、只读不续期、非法配置、容量、拒写、删除与歧义。
- **T02 / R02 / S04–S05：** RPC 与监控拆分，客户端 origin/source/requestId、等待/取消/共享实例及脱敏回归；普通/debug 真实 React 代理组件使用同一处理器。Passport 代理测试 33/33 通过。初次 JSX 转换错误属于测试配置问题，已使用实际 Vitest 内部 Vite 的 OXC 配置，并改为 ESM `.mjs` 配置入口；未将导入失败记作业务 RED。
- **T03 / R03 / S06–S08：** 本地优先真实旧逻辑 RED 为返回 remote 而预期 local；远端空字符串回归 RED 为返回空串而预期 null，收口后读取 9/9 通过。Fetcher GET/POST/下载、FileUploader 实际挂载与 WebSocket 5 项测试核对原 token 的传输形式及现有后端拒绝处理，未改消费者生产协议。
- **T04 / R04 / S09–S11：** 真实旧 logout 返回 undefined 的 RED；统一等待清理并 finally 释放。登录状态与 hook 6/6 通过，包含共享 Cookie 歧义不误报成功、A 写失败保留 B、清 B/A、实际无 token 清用户资料、卸载销毁。真实登录页 3/3 通过，覆盖默认会话、勾选 14+1、原登录字段及保存失败不跳转。
- **T05 / R05 / S12：** 四站配置测试先 3/3 失败，统一新 key `sparrow_sso_token`、生产 COOKIE/父域/Secure/Lax、开发 LOCAL 后通过；审查补充生产关闭调试断言，先失败再修正，3/3 通过。复制命令均在子站执行，修改始终来自 Common。

<a id="review"></a>
## 独立审查与修正

审查者交叉读取非本人实现的存储、facade、RPC、代理与登录展示代码，结论基于真实源码与 TRD，不要求新增已明确排除的后端、并发或跨标签平台。

| 发现 | 影响 | 处理与证据 |
|---|---|---|
| 共享 Cookie 配置不能证明 B 没有同名 host-only 旧值 | A 保存成功但 B 仍歧义 | 保存后本地读回校验；歧义明确失败、不删除共享新值；登录状态回归覆盖。 |
| 无 `=` Cookie 项被截去最后字符后误匹配名称 | 错误本地命中跳过 A | 仅解析有 `=` 的完整名称；真实 jsdom RED→36/36 GREEN。 |
| Common 生产调试开关仍为 true | 意外走可见 debug iframe | 四站显式 false；配置断言 RED→GREEN。 |
| 临时 RPC 实例请求后仍持有监听 | 现有消费者每次请求会累积监听 | 在 RPC 内处理空闲解绑并复用已验证 frame，保持消费者边界不变；最终 23 项 RPC 回归通过，成功/错误/超时/销毁/同步重入由独立审查复核；无持续监听增长。 |
| Header 将读取错误转成访客 | 与未知凭证状态及缓存资料冲突 | 区分错误与确无 token，提供重试；真实 Header 5 项通过，包含读取错误重试、缺失清理、不可解析展示及卸载迟到结果；与登录状态共 11 项通过。 |
| 远端空字符串没有规范为 null | 无 token 返回契约不一致 | 仅在 getToken 归一化，不改变通用 CRUD；读取 9/9 通过。 |

<a id="builds"></a>
## 构建与环境

- Node.js 22.16.0；依赖统一 Yarn，安装完成且原 node_modules 备份保留。测试和构建不修改业务运行中的 `.next-dev`。
- 原 `.next`、`out` 中含 root 所有文件，直接构建因 EACCES 失败；Common 字体下载在沙箱中 DNS 失败，获工具批准后联网编译到类型检查阶段。测试配置类型冲突已改用 ESM `.mjs` 入口解决。
- 完整构建使用当前源码的临时目录副本（不复制 `.next`、`out`、`node_modules`），依赖链接到已安装的各站 node_modules。不覆盖原静态发布目录；四站完整 compile/lint/types/static export 均退出 0；Common 47、Admin 15、IM 33、Passport 16 个静态页面。逐文件核对临时副本与当前生产源码/配置一致，并确认两个代理页面均导出，见[构建报告](validation/build-2026-09-28.json)。

<a id="browser"></a>
## 真实浏览器与未验证范围

- Playwright 首次在沙箱内启动 Chrome 失败，未进入业务断言，不记作业务 RED。获工具批准后使用本机真实 Chrome、临时 HTTPS SAN 证书和三域映射，未改系统 hosts/证书信任。
- 首轮真实浏览器 9/9 通过；此前 4 项失败来自夹具 monitor 误选 debug 路由及通用 RPC 事件字段假设，已修正为加载真实普通/debug 页面和观察实际消息。跨根观察为 Lax 空值、None 原 token；这只代表该浏览器与本次配置。
- 最终 RPC 修正后浏览器回归已再次通过 9/9，实际 Chrome 153.0.8010.53；[脱敏报告](validation/browser-2026-09-28.json)记录版本、参数、三域、物理 Cookie 属性及结果。Playwright 默认禁用特性参数已恢复默认，未为跨根成功关闭浏览器 Cookie 保护。
- **未验证：** iOS Safari 与 Android Chrome 真机、线上故障环境复现、真实后端续期/撤销联调、生产发布及跨根域上线。真机缺少实际设备/接入，T06 不能标 done。前端模拟测试不能替代这些结果。

<a id="delivery"></a>
## 提交与交付

- 实施验收阶段尚未提交；U13 后进入 Git 集成。提交使用 Conventional Commits 和完整 Task trailer，实际提交/推送结果由 Git 历史及交付消息核对，不在提交内写入自身 hash。用户另行暂存的旧文档归档保留，不混入 SSO 提交。
- 状态由 plan.yaml 维护，最终生成 plan.md、task-status.md 并运行 check；结构校验不等于业务验收。
- 原依赖与构建缓存备份留在本机临时目录，不纳入开源文档或源码。测试日志只记录合成凭证，不含真实 token；持久报告须脱敏个人路径。

## 最终交付核对 · 2026-09-28

- **上下文/输入：** 修复独立审查发现后冻结生产代码，三站重新 copy；当前源码、配置、任务场景与测试。
- **输出/结果：** Common 9 文件 94/94、Passport 2 文件 36/36，合计 **130/130**；[逐项结果与源文件 hash](validation/unit-2026-09-28.json)。Chrome **9/9**（7 个行为验证＋2 个跨根观察），四站完整生产构建通过，86 个共享源文件与三站副本逐字节一致。
- **证据范围：** 单元/组件报告记录实际 `yarn test:auth`；浏览器报告保留实际执行的 npm script 调用（只运行同一 Playwright 脚本，没有安装依赖），依赖安装已全部按 U12 改用 Yarn。发布前可按 plan.yaml 的等价 Yarn 脚本复跑。
- **验收结论：** T01—T05 完成；T06 桌面自动化通过，但 iOS Safari/Android Chrome 真机缺少实际设备/接入，标记 blocked。未把观察到的跨根成功泛化到其他浏览器；未宣称线上问题已验收修复。
- **验收时追溯：** 上述验收时尚未提交或部署；后续 Git 集成依据 U13。四列 task-status.md 根据上述真实状态生成；本目录文档、源文件 hash 与报告关联完整，未使用其他需求文档作依据。

- **最终独立复核：** 另一执行者只读核对任务状态、测试总数、四站临时构建及限制；独立重算单元报告 113 个、浏览器报告 14 个源码 hash 均匹配当前文件，未发现必须修正问题、个人路径或真实凭证。
- **结构与生成：** validate、render、status、check 均实际返回 0；git diff --check 通过。用户原有需求文档与实施前 hash 一致，本轮未改动。

### 提交前复验与配置对齐

- **输入：** U13；当前源码及四站环境配置。提交前核对发现开发环境均已变为 COOKIE，先前报告对应 LOCAL；旧测试因此实际出现 93/94 通过、1 失败，不能直接复用原全绿结论。
- **处理：** 保留现有开发 COOKIE 值，同步 host-only、HTTP Secure=false 的注释、TRD 与配置断言；不回退使用者的配置。生产配置与业务源码未变化，原桌面浏览器及生产构建证据按未受影响范围复用。
- **提交范围：** 当前需求代码、测试、四站配置、依赖锁文件和自包含需求文档；AGENTS.md 仅加入本轮 Yarn 安装规则。旧文档归档、openspec 暂存状态及其他已有约定保持在原工作区。
- **集成：** 从 bug_req-r01-sso-token-storage 提交，正常 push，合并 master；不强推，不部署。真机缺失仍保持 T06 blocked。

- **提交前复验结果：** 调整开发环境配置断言后，Common 94/94、Passport 36/36 再次通过；unit 报告已刷新到本次运行及当前源码 hash。先前 build 报告保留构建时摘要，并标明后续仅开发配置变化，未声称对新的开发配置执行生产构建。
