因为这里生成的全部模板，thymeleaf 不可用，具体原因见
sparrowzoo 的博客技术方案说明文档
所以这里只生成head 然后借AI生成原生头保持一致

prompt

```
@common/src/app/(index)/thymeleaf/page.tsx 请根据组件内容 生成HTML片断 提供给thymeleaf
模板使用 注意是HTML片断然后会嵌入到html中 要1比1 原生HTML JS CS
文件保存至 `public/header.html`
```
            
