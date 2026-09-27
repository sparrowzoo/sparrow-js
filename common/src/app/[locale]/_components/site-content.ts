// Public documents use absolute paths so locale prefixes never change their URLs.
export const documents = [
    {id: "session-storage-boundaries-postmessage-sso", category: "frontend", subcategory: "React", topic: "Web Storage / RPC", href: "/frontend/react/session-storage-boundaries-postmessage-sso.html", keywords: "Web Storage sessionStorage localStorage Safari Chrome mobile iOS iframe postMessage SSO RPC CrosStorage Cookie HttpOnly credentials SameSite Domain host-only authorization code same-origin same-site top-level context 移动端 存储边界 分区 同源 同站 顶层上下文 跨域 单点登录 请求响应 诊断 授权码 会话 Cookie鉴权"},
    {id: "nginxHttpsLaunch", category: "backend", subcategory: "Nginx", topic: "Nginx", href: "/backend/nginx/nginx-https-launch.html", keywords: "Nginx HTTPS Certbot Let's Encrypt SSL 443 301 证书 签发 续期 X-Forwarded-Proto WebSocket wss 上线 部署"},
    {id: "htmlFragmentEmbed", category: "frontend", subcategory: "React", topic: "React", href: "/frontend/react/html-fragment-embed.html", keywords: "React createRoot useEffect HtmlFragment 嵌入 非React 页面 客服 IM HTML片段 挂件 静态导出 output export"},
    {id: "launchRunbook", category: "backend", subcategory: "Nginx", topic: "Nginx", href: "/backend/nginx/next15-http-launch.html", keywords: "Next.js 15 HTTP WS Nginx static release deploy rollback 上线 操作 构建 发布 回滚 静态"},
    {id: "tencentExmail", category: "backend", subcategory: "Mail", topic: "SMTP / IMAP", href: "/backend/mail/tencent-exmail-client-configuration.html", keywords: "腾讯企业邮箱 企业微信 Tencent Exmail WeCom JavaMail Spring Boot Foxmail Outlook SMTP IMAP POP3 535 授权码 客户端专用密码 authentication"},
    {id: "bom", category: "backend", subcategory: "Java", topic: "Maven", href: "/backend/java/maven/sparrow-parent-bom.html", keywords: "Java Parent BOM Starter architecture 架构 依赖"},
    {id: "openapi", category: "backend", subcategory: "Java", topic: "OpenAPI", href: "/backend/java/open-api/open-api.html", keywords: "Java Spring Boot springdoc Swagger 接口"},
    {id: "groups", category: "backend", subcategory: "Java", topic: "OpenAPI", href: "/backend/java/open-api/open-api-group.html", keywords: "Java Spring Boot springdoc Swagger 分组"},
    {id: "maven", category: "backend", subcategory: "Java", topic: "Maven", href: "/backend/java/maven/maven-source-debug.html", keywords: "Java sources debug 调试 断点"},
    {id: "oom", category: "backend", subcategory: "Java", topic: "Netty", href: "/backend/java/netty/netty-oom.html", keywords: "Java memory release 内存 释放"},
    {id: "memory", category: "backend", subcategory: "Java", topic: "Netty", href: "/backend/java/netty/netty-memory-bug.html", keywords: "Java ByteBuf reference count 内存 引用计数"},
    {id: "thymeleaf", category: "backend", subcategory: "Java", topic: "Thymeleaf", href: "/backend/java/thymeleaf/thymeleaf.html", keywords: "Java Spring template prefix 模板 路径"},
    {id: "captcha", category: "frontend", subcategory: "React", topic: "React", href: "/frontend/react/captcha.html", keywords: "useCaptcha Hook authentication 验证码"},
    {id: "intl", category: "frontend", subcategory: "React", topic: "Next.js", href: "/frontend/react/next-intl/i18n.html", keywords: "React next-intl i18n locale 国际化 多语言"},
] as const;

export const productIds = ["scaffold", "passport", "file", "security", "im", "coder", "ui"] as const;
