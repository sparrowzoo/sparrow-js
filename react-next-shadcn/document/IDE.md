# 开发环境

## 官方文档支持

https://tailwindcss.com/docs/editor-setup
https://www.jetbrains.com.cn/en-us/help/idea/2021.2/tailwind-css.html

## Tailwind CSS

`注意idea 只识别tailwind.config.js 不识别tailwind.config.ts`

Required plugins:

- CSS - The plugin is available only in IntelliJ IDEA Ultimate, where it is enabled by default.
- Tailwind CSS - Install the plugin on the Settings/Preferences | Plugins page, tab Marketplace. The plugin is available
  only in IntelliJ IDEA Ultimate.
  IntelliJ IDEA integrates with the Tailwind CSS framework including completion for Tailwind classes in HTML files and
  completion suggestions for pseudo-class variants, preview of the resulting CSS on hovering over classes in HTML and
  CSS files or on autocompletion. IntelliJ IDEA recognizes tailwind.config.js files and provides completion based on
  customization you make to them.

Before you start

- Make sure you have Node.js on your computer.
- Make sure the CSS bundled plugin is enabled in the Installed tab of the Settings/Preferences | Plugins page as
  described in Managing plugins.
- Install and enable the Tailwind CSS plugin on the Settings/Preferences | Plugins page, tab Marketplace, as described
  in Installing plugins from JetBrains repository.
  Install Tailwind CSS
    - Open the embedded Terminal (⌥ F12) and type:
  ```
  npm install tailwindcss postcss autoprefixer 
  ```
    - To configure your Tailwind CSS installation, generate a tailwind.config.js configuration file in the root of your
      project. In the embedded Terminal (⌥ F12) , type:
  ```
  npx tailwindcss init
  ```
  Learn more from the Tailwind CSS official website.


