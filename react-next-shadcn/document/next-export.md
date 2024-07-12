npm run export (next export)配置过期不允许用
使用npm run build +next.config.js 的配置output:export

Next.js enables starting as a static site or Single-Page Application (SPA), then later optionally upgrading to use
features that require a server.

When running next build, Next.js generates an HTML file per route. By breaking a strict SPA into individual HTML files,
Next.js can avoid loading unnecessary JavaScript code on the client-side, reducing the bundle size and enabling faster
page loads.

Since Next.js supports this static export, it can be deployed and hosted on any web server that can serve HTML/CSS/JS
static assets.

https://nextjs.org/docs/app/building-your-application/deploying/static-exports
