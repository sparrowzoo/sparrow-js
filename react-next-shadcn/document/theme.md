# Theming

https://ui.shadcn.com/docs/theming

https://ui.shadcn.com/themes

https://ui.shadcn.com/docs/dark-mode/next

使用CSS变量或者tailwind utility class

Using **`CSS Variables`** or Tailwind CSS for theming.
You can choose between using **`CSS variables`** or 
**`Tailwind CSS utility classes** `for theming.

## Utility classes
<div className="bg-zinc-950 dark:bg-white" />
Copy
To use utility classes for theming 

set `tailwind.cssVariables to false` in your components.json file.
设置cssVariables 为false
```
components.json
{
"style": "default",
"rsc": true,
"tailwind": {
"config": "tailwind.config.js",
"css": "app/globals.css",
"baseColor": "slate",
"cssVariables": false
},
"aliases": {
"components": "@/components",
"utils": "@/lib/utils"
}
}
```
## CSS Variables

设置cssVariables 为true 而且脚手架生成时一定选择true
<div className="bg-background text-foreground" />

To use CSS variables for theming set `tailwind.cssVariables to true` in your components.json file.
```
components.json
{
"style": "default",
"rsc": true,
"tailwind": {
"config": "tailwind.config.js",
"css": "app/globals.css",
"baseColor": "slate",
"cssVariables": true
},
"aliases": {
"components": "@/components",
"utils": "@/lib/utils"
}
}

```

注意如果使用css 变量，这里脚手架生成时，一定选择true 官方的主题才会生效

Configure components.json
You will be asked a few questions to configure components.json:

Which style would you like to use? › Default
Which color would you like to use as base color? › Slate
Do you want to use CSS variables for colors? › no / yes
