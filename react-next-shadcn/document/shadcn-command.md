# 脚手架说明文档

https://ui.shadcn.com/docs/cli

##  init初始化
```
npx shadcn-ui@latest init
```

```
You will be asked a few questions to configure components.json:

Would you like to use TypeScript (recommended)? no/yes
Which style would you like to use? › Default
Which color would you like to use as base color? › Slate
Where is your global CSS file? › › app/globals.css
Do you want to use CSS variables for colors? › no / yes
Where is your tailwind.config.js located? › tailwind.config.js
Configure the import alias for components: › @/components
Configure the import alias for utils: › @/lib/utils
Are you using React Server Components? › no / yes

Options
Usage: shadcn-ui init [options]
initialize your project and install dependencies
Options:
  -y, --yes        skip confirmation prompt. (default: false)
  -c, --cwd <cwd>  the working directory. defaults to the current directory.
  -h, --help       display help for command
```
## add
Use the add command to add components and dependencies to your project.

npx shadcn-ui@latest add [component]

You will be presented with a list of components to choose from:
-o, --overwrite    overwrite existing files. (default: false)

```
Usage: shadcn-ui add [options] [components...]
add a component to your project
Arguments:
components         the components to add
Options:
-y, --yes          skip confirmation prompt. (default: false)
-o, --overwrite    overwrite existing files. (default: false)
-c, --cwd <cwd>    the working directory. defaults to the current directory.
-p, --path <path>  the path to add the component to.
-h, --help         display help for command
```