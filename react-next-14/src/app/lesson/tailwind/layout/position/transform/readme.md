# 在HTML5/CSS3中，transform与position: fixed的交互关系存在特定行为规则，以下是关键要点：

## 基础定位规则

- fixed的默认基准‌
  正常情况下，fixed元素会相对于浏览器视口（viewport）定位，不受文档流滚动影响。

- transform的层叠上下文‌
  当祖先元素应用transform（即使值为translate(0,0)），会创建新的包含块（containing block），导致内部fixed元素以该祖先为定位基准而非视口
