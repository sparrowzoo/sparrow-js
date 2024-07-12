# You should not manually add tags such as and to root layouts. Instead, you should use the Metadata API

https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts

Good to know: You should not manually add <head> tags such as <title> and <meta> to root layouts. Instead, you should
use the Metadata API which automatically handles advanced requirements such as streaming and de-duplicating <head>
elements.

Good to know:

- The .js, .jsx, or .tsx file extensions can be used for Pages.
- A page is always the leaf of the route subtree.
- A page.js file is required to make a route segment publicly accessible.
- Pages are Server Components by default, but can be set to a Client Component.
- Pages can fetch data. View the Data Fetching section for more information.

## Root Layout (Required)

The root layout is defined at the top level of the app directory and applies to all routes.
This layout is required and must contain `html` and `body` tags, allowing you to modify the initial HTML returned from
the server.

Good to know:

- .js, .jsx, or .tsx file extensions can be used for Layouts.
- Only the root layout can contain `<html>` and `<body>` tags.
- When a layout.js and page.js file are defined in the same folder, the layout will wrap the page.
- Layouts are `Server Components`by default but can be set to a `Client Component`.
- Layouts can fetch data. View the Data Fetching section for more information.
- Passing data between a parent layout and its children is not possible. However, you can fetch the same data in a route
  more than once, and React will automatically dedupe the requests without affecting performance.
- Layouts do not have access to the route segments below itself. To access all route segments, you can use
  useSelectedLayoutSegment or useSelectedLayoutSegments in a Client Component.
- You can use Route Groups to opt specific route segments in and out of shared layouts.
- You can use Route Groups to create multiple root layouts. See an example here.
- Migrating from the pages directory: The root layout replaces the _app.js and _document.js files. View the migration
  guide.

## Metadata

In the app directory, you can modify the <head> HTML elements such as title and meta using the Metadata APIs.

Metadata can be defined by exporting a metadata object or generateMetadata function in a layout.js or page.js file.

app/page.tsx
TypeScript

```typescript


import {Metadata} from 'next'

export const metadata: Metadata = {
    title: 'Next.js',
}

export default function Page() {
    return '...'
}
```

Good to know:
You `should not manually add <head> tags such as <title> and <meta>` to root layouts.
Instead,
you should use the Metadata API which automatically handles advanced requirements such as streaming and
de-duplicating <head> elements.

## viewport

https://nextjs.org/docs/app/api-reference/functions/generate-metadata

https://nextjs.org/docs/app/api-reference/functions/generate-viewport
Deprecated: The viewport option in metadata is deprecated as of Next.js 14. Please use the viewport configuration
instead.

### The viewport object

To define the viewport options, export a viewport object from a layout.jsx or page.jsx file.

layout.tsx | page.tsx

```typescript

import type {Viewport} from 'next'

export const viewport: Viewport = {
    themeColor: 'black',
}

export default function Page() {
}
```

### width, initialScale, maximumScale and userScalable

Good to know: The viewport meta tag is automatically set, and manual configuration is usually unnecessary as the default
is sufficient. However, the information is provided for completeness.

layout.tsx | page.tsx

```html
import type { Viewport } from 'next'

export const viewport: Viewport = {
width: 'device-width',
initialScale: 1,
maximumScale: 1,
userScalable: false,
// Also supported by less commonly used
// interactiveWidget: 'resizes-visual',
}
<head>
```

output

```html

<meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
```

### tailwind Responsive Design

https://tailwindcss.com/docs/responsive-design
Using responsive utility variants to build adaptive user interfaces.

Overview
Every utility class in Tailwind can be applied conditionally at different breakpoints, which makes it a piece of cake to
build complex responsive interfaces without ever leaving your HTML.

First, make sure you’ve added the viewport meta tag to the <head> of your document:

```html

<meta name="viewport" content="width=device-width, initial-scale=1.0">

```


