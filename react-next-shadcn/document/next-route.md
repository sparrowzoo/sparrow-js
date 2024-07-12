# Defining Routes

We recommend reading the Routing Fundamentals page before continuing.
This page will guide you through how to define and organize routes in your Next.js application.

## Creating Routes

Next js 使用基于文件系统的路由，即用文件夹作为路由定义
Next.js uses a file-system based router where folders are used to define routes.

## Route Groups

In the app directory, nested folders are normally mapped to URL paths.
However, you can mark a folder as a Route Group to prevent the folder from being included in the route's URL path.

This allows you to organize your route segments and project files into logical groups without affecting the URL path
structure.

### Route groups are useful for:

Organizing routes into groups e.g. by site section, intent, or team.
Enabling nested layouts in the same route segment level:
Creating multiple nested layouts in the same segment, including multiple root layouts
Adding a layout to a subset of routes in a common segment

### Convention

A route group can be created by wrapping a folder's name in parenthesis: (folderName)
带括号的文件夹

Examples
Organize routes without affecting the URL path
To organize routes without affecting the URL, create a group to keep related routes together.
The folders in parenthesis will be omitted from the URL (e.g. (marketing) or (shop)).

## Dynamic Routes

When you don't know the exact segment names ahead of time and want to create routes from dynamic data, you can use
Dynamic Segments that are filled in at request time or prerendered at build time.

### Convention

A Dynamic Segment can be created by wrapping a folder's name in square brackets: [folderName]. For example, [id]
or [slug].

Dynamic Segments are passed as the params prop to layout, page, route, and generateMetadata functions.

### Example

For example, a blog could include the following route app/blog/[slug]/page.js where [slug] is the Dynamic Segment for
blog posts.

app/blog/[slug]/page.tsx

```html
export default function Page({ params }: { params: { slug: string } }) {
return
<div>My Post: {params.slug}</div>
}
```

Route Example URL params
app/blog/[slug]/page.js /blog/a { slug: 'a' }
app/blog/[slug]/page.js /blog/b { slug: 'b' }
app/blog/[slug]/page.js /blog/c { slug: 'c' }

See the generateStaticParams() page to learn how to generate the params for the segment.

Good to know: `Dynamic Segments are equivalent to Dynamic Routes in the pages directory.`

Generating Static Params
`The generateStaticParams function can be used in combination with dynamic route segments to statically generate routes
at build time instead of on-demand at request time.`

app/blog/[slug]/page.tsx
TypeScript

```

export async function generateStaticParams() {
const posts = await fetch('https://.../posts').then((res) => res.json())
return posts.map((post) => ({
slug: post.slug,
}))
}
```

The primary benefit of the generateStaticParams function is its smart retrieval of data. If content is fetched within
the generateStaticParams function using a fetch request, the requests are automatically memoized. This means a fetch
request with the same arguments across multiple generateStaticParams, Layouts, and Pages will only be made once, which
decreases build times.

