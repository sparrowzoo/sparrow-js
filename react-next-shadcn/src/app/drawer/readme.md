# Drawer

## Usage 官方文档
https://ui.shadcn.com/docs/components/drawer

Drawer is built on top of Vaul by emilkowalski（作者）
https://github.com/emilkowalski/vaul

```
Examples

Play around with the examples on codesandbox:
With scaled background
Without scaled background
With snap points
Scrollable with inputs
Drawer from right instead of bottom
https://codesandbox.io/p/devbox/drawer-direction-right-n338ml?file=%2Fapp%2Fmy-drawer.tsx
Nested drawers
Non-dismissible
Non-draggable element
```
## 如何解决右侧抽屉的样式问题？

1. 用浏览器查看相关元素的样式，找到原代码中对应的样式。分析每个样式函义。
2. 定位'inset-x-0' 导致右侧抽屉的样式问题。

## 解决方案：
1. 直接删除drawer组件的'inset-x-0'样式。
缺点：改变原始样式，违背开闭原则
2. 给<DrawerContent className=" bg-white inset-[unset] ">添加样式。
twMerge 插件帮我们实现覆盖策略，可以覆盖掉原有样式。