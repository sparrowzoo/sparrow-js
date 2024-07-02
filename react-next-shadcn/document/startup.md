# Next.js
Install and configure Next.js.
## Create project
Start by creating a new Next.js project using create-next-app:
```
npx create-next-app@latest my-app --typescript --tailwind --eslint

√ What is your project named? ... react-next-shadcn
√ Would you like to use TypeScript? ... No / Yes
√ Would you like to use ESLint? ... No / Yes 
√ Would you like to use Tailwind CSS? ... No / Yes
√ Would you like to use `src/` directory? ... No / Yes
√ Would you like to use App Router? (recommended) ... No / Yes
√ Would you like to customize the default import alias (@/*)? ... No / Yes
√ What import alias would you like configured? ... @/ 注意默认直接回车

Creating a new Next.js app in ~\sparrow\sparrow-js\react-next-shadcn.
```
相应的在tsconfig.json的配置会生成
```
 "paths": {
      "@/*": ["./src/*"]
  }
  需要手动加上
   "baseUrl": "./",
```

## Run the CLI
Run the shadcn-ui init command to setup your project:
```
npx shadcn-ui@latest init
```
## Configure components.json
You will be asked a few questions to configure components.json:
```
Which style would you like to use? › Default
Which color would you like to use as base color? › Slate
Do you want to use CSS variables for colors? › no / yes
```
## Fonts
I use Inter as the default font. Inter is not required. You can replace it with any other font.

Here's how I configure Inter for Next.js:

###  Import the font in the root layout:
```
import "@/styles/globals.css"
import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"

const fontSans = FontSans({
subsets: ["latin"],
variable: "--font-sans",
})

export default function RootLayout({ children }: RootLayoutProps) {
return (
<html lang="en" suppressHydrationWarning>
<head />
<body
className={cn(
"min-h-screen bg-background font-sans antialiased",
fontSans.variable
)}
>
...
</body>
</html>
)
}
```
###  Configure theme.extend.fontFamily in tailwind.config.js

```
const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
darkMode: ["class"],
content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
theme: {
extend: {
fontFamily: {
sans: ["var(--font-sans)", ...fontFamily.sans],
},
},
},
}
```
## App structure

Here's how I structure my Next.js apps. You can use this as a reference:
```
.
├── app
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── ui
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ...
│   ├── main-nav.tsx
│   ├── page-header.tsx
│   └── ...
├── lib
│   └── utils.ts
├── styles
│   └── globals.css
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

I place the UI components in the components/ui folder.
The rest of the components such as <PageHeader /> and <MainNav /> are placed in the components folder.
The lib folder contains all the utility functions. I have a utils.ts where I define the cn helper.
The styles folder contains the global CSS.

## That's it
You can now start adding components to your project.
```
npx shadcn-ui@latest add button
```
The command above will add the Button component to your project. You can then import it like this:
```
import { Button } from "@/components/ui/button"

export default function Home() {
return (
<div>
<Button>Click me</Button>
</div>
)
}
```