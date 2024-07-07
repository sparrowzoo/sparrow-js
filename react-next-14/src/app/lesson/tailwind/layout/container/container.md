# Container
A component for fixing an element's width to the current breakpoint.
Quick reference
```
Class       Breakpoint          Properties
container	    None	        width: 100%;
            sm (640px)	        max-width: 640px;
            md (768px)	        max-width: 768px;
            lg (1024px)	        max-width: 1024px;
            xl (1280px)	        max-width: 1280px;
            2xl (1536px)	    max-width: 1536px;

https://tailwindcss.com/docs/responsive-design
Breakpoint-prefix	Minimum-width	    CSS
sm	                640px	            @media (min-width: 640px) { ... }
md	                768px	            @media (min-width: 768px) { ... }
lg	                1024px	            @media (min-width: 1024px) { ... }
xl	                1280px	            @media (min-width: 1280px) { ... }
2xl	                1536px	            @media (min-width: 1536px) { ... }
```

## Basic usage

Using the container
The container class sets the max-width of an element to match the min-width of the current breakpoint.
这个类设计在当前断点的最大宽度
This is useful if you’d prefer to design for a fixed set of screen sizes instead of trying 
to accommodate a fully fluid viewport.

Note that unlike containers you might have used in other frameworks, Tailwind’s container does not center itself automatically and does not have any built-in horizontal padding.


