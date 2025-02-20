## Dynamic Routes

When you don't know the exact segment names ahead of time and want to create routes from dynamic data, you can use
Dynamic Segments that are filled in at request time or prerendered at build time.

所谓的动态路由就是你事先不知道具体的路由，需要在请求时或者在编译时动态的添充。

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

在构建时生成而不是在请求时生成

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

