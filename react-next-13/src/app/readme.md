swipper 组件显示不正常是由于

```agsl
<html lang="en">
      <body className={inter.className}>{children}</body>
</html>
```

缺少<body>标签导致
与版本无关

### `注意基本常识，保持html结构是完整的`
