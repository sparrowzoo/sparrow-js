# Aspect Ratio
https://tailwindcss.com/docs/aspect-ratio#basic-usage
Utilities for controlling the `aspect ratio`(宽高比) of an element.

## Class
Properties
aspect-auto	    aspect-ratio: auto;
aspect-square	aspect-ratio: 1 / 1;
aspect-video	aspect-ratio: 16 / 9;

### Use the aspect-* utilities
to set the desired(期望) aspect ratio of an element.（元素的宽高比）
```
<iframe class="w-full aspect-video ..." src="https://www.youtube.com/..."></iframe>
```

### Hover, focus, and other states
Tailwind lets you conditionally apply utility classes in different states using variant modifiers. For example, use hover:aspect-square to only apply the aspect-square utility on hover.

### Breakpoints and media queries
```
md:aspect-square
https://tailwindcss.com/docs/responsive-design
Breakpoint-prefix	Minimum-width	CSS
sm	                640px	            @media (min-width: 640px) { ... }
md	                768px	            @media (min-width: 768px) { ... }
lg	                1024px	            @media (min-width: 1024px) { ... }
xl	                1280px	            @media (min-width: 1280px) { ... }
2xl	                1536px	            @media (min-width: 1536px) { ... }
```
You can also use variant modifiers to target media queries like responsive breakpoints, dark mode, prefers-reduced-motion, and more. For example, use md:aspect-square to apply the aspect-square utility at only medium screen sizes and above.
There are five breakpoints by default, inspired by common device resolutions:
<iframe class="w-full aspect-video md:aspect-square" src="https://www.youtube.com/..."/>

### Arbitrary values

aspect-[4/3] 自定义宽高比
```
If you need to use a one-off aspect-ratio value that doesn’t make sense to include in your theme, use square brackets to generate a property on the fly using any arbitrary value.
<iframe class="w-full aspect-[4/3]" src="https://www.youtube.com/..."></iframe>
```

