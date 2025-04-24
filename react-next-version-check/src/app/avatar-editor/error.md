https://sparrowzoo.feishu.cn/docx/LSZ7dibc0oroaMx55GDcSkZXnza

在React应用中遇到
Warning: Prop width did not match. Server: "550" Client: "1100"
的警告，通常是由于服务器端渲染（SSR）与客户端渲染（CSR）的初始状态不一致导致的12。以下是具体原因及解决方案：
禁用SSR
动态导入‌：对需要动态计算的组件禁用SSR：

```typescript
const AvatarCutter = dynamic(() => import("@/components/AvatarCutter"), {
    ssr: false,
});
```

```typescript


app - index.tsx
:
25
Warning: React
does
not
recognize
the`showGrid`
prop
on
a
DOM
element.If
you
intentionally
want
it
to
appear in the
DOM as a
custom
attribute, spell
it as lowercase
`showgrid`
instead.If
you
accidentally
passed
it
from
a
parent
component, remove
it
from
the
DOM
element.at
canvas
at
a(webpack - internal
:///(app-pages-browser)/./node_modules/react-avatar-editor/dist/index.js:1:4960)
at
div
at
eval(webpack - internal
:///(app-pages-browser)/./node_modules/react-dropzone/dist/es/index.js:66:23)
at
div
at
AvatarCutter(webpack - internal
:///(app-pages-browser)/./src/components/AvatarCutter.tsx:16:84)
at
BailoutToCSR(webpack - internal
:///(app-pages-browser)/./node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-bailout-to-csr.js:13:11)
at
Suspense
at
LoadableComponent
```
