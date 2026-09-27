---
name: write-doc
description: 撰写一篇权威技术文档：按统一文章模板生成静态 HTML，落到 common/public 对应分类目录，并在首页文档目录（site-content.ts + i18n）按时间倒排登记。用户要求「写文档 / 写文章 / 写一篇 XX 的说明 / 沉淀 XX 实践」时使用。
---

# 写文档 write-doc

把某个主题沉淀为一篇权威、风格统一的技术文章，放到文档站 `common/public/`，并登记到首页「开发文档」目录。

## 一、先读模板与范例

1. 风格规范：`common/ai/文章编写提示词.md`
2. 最完整范例（结构、配色、组件照抄它）：`common/public/backend/java/maven/sparrow-parent-bom.html`

## 二、确定分类与落盘路径

按主题映射到 `common/public/` 下已有分类目录，并确定 `category / subcategory / topic`：

| 主题 | 目录 | category | subcategory | topic |
| --- | --- | --- | --- | --- |
| React | `frontend/react/` | frontend | React | React |
| Next.js（国际化） | `frontend/react/next-intl/` | frontend | React | Next.js |
| Nginx / 部署 | `backend/nginx/` | backend | Nginx | Nginx |
| 邮件 / SMTP | `backend/mail/` | backend | Mail | SMTP / IMAP |
| Maven | `backend/java/maven/` | backend | Java | Maven |
| Netty | `backend/java/netty/` | backend | Java | Netty |
| Thymeleaf | `backend/java/thymeleaf/` | backend | Java | Thymeleaf |
| OpenAPI / Swagger | `backend/java/open-api/` | backend | Java | OpenAPI |

规则：

- 文件名用 kebab-case，如 `maven-source-debug.html`。
- 若主题在 `common/public/` 下没有对应分类目录，**停下来问用户**：是否新建分类、目录名与 `category / subcategory / topic` 如何取值，不要擅自新建。

## 三、写文章 HTML

写到第二步确定的路径，严格遵循风格规范：

**配色与视觉**

- 深色主题：背景 `#07070d`，面板/边框半透明白（面板 4%、边框 8%），文字三级 `#f4f4f7 / #9a9ab0 / #64647c`。
- 强调渐变：紫 `#6d5cff` → 青 `#22d3ee` → 粉紫 `#a855f7`，圆角 18px，背景叠加径向光斑 + 网格噪点。
- 标题用紫青粉渐变文字；按钮胶囊形 + 渐变、卡片悬浮上移；代码块深底 `#0c0c16` + 等宽字体。

**结构（固定）**

```
# 标题
## 结论先行     → 先给结论，最好有官方说明，保证权威、严谨
## 问题背景     → 当前问题上下文，对小白友好
## 详细内容     → 分 STEP 一步一步讲清；有对比用表格/图表；最后总结归纳
## 总结归纳     → 形成结论 + 官方依据/参考链接
```

**每篇必须保留**

- 顶部 banner 导航（导航条 + 面包屑 + 返回首页）
- 右侧阅读目录（TOC，滚动高亮）+ 顶部阅读进度条
- 微信分享（Open Graph meta + 分享按钮）
- 头图（hero 区 inline SVG 封面图）

**权威性**：关键结论引用官方文档/规范，并附原文链接。

**敏感内容脱敏**：文中如涉及真实域名、公网 IP、端口、账号、密码、token、密钥、证书路径、内部目录、内部服务名等敏感信息，发布前一律脱敏——用占位符（`example.com`、`127.0.0.1`、`<REDACTED>`、`/path/to/...`）或泛指替代真实值，不暴露生产地址与凭证。

## 四、登记到首页目录（时间倒排，最新靠前）

1. 在 `common/src/app/[locale]/_components/site-content.ts` 的 `documents` 数组**最前面**插入一条：

   ```ts
   { id: "<kebab-case>", category: "<...>", subcategory: "<...>", topic: "<...>", href: "<相对 public 根的路径>", keywords: "<中英文关键词，空格分隔>" },
   ```

   - `href` 是相对 `common/public/` 的路径，如 `/backend/java/maven/maven-source-debug.html`
   - `id` 全局唯一，kebab-case
2. 在 `common/messages/website/zh.json` 和 `en.json` 的 `docs.items.<id>` 补 `title` / `description`。

注意：这些是纯静态 HTML，直接放 `common/public/`，**不需要 `npm run copy`**。

## 五、完成自检

- [ ] 文章 HTML 已在 `common/public/` 正确分类目录下
- [ ] `site-content.ts` 的 `documents` 数组第一条是本篇
- [ ] `zh.json` / `en.json` 均已补 `docs.items.<id>`
- [ ] 结构含「结论先行 / 问题背景 / 详细内容 / 总结归纳」，并保留 banner 导航、TOC、进度条、微信分享、头图
- [ ] 敏感信息已脱敏（域名、IP、端口、账号、密码、token、证书路径、内部目录等用占位符替代）
