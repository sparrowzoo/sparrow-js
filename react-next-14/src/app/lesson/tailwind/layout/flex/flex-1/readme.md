
# css flex 1 1 0%
在CSS中，flex是flex-grow, flex-shrink 和 flex-basis的缩写。
这三个属性定义了flex项在flex容器内的行为。

## flex-grow属性
定义了flex项相对于其他flex项的放大比例，默认为0，即即使容器内有剩余空间，项目也不会放大。

## flex-shrink属性
定义了flex项相对于其他flex项的缩小比例，默认为1，即如果空间不足，该项目将缩小。

## flex-basis属性

定义了在分配多余空间之前，项目占据的主轴空间（main size）。

所以，"1 1 0%" 表示 flex-grow 为 1，flex-shrink 为 1，flex-basis 为 0%。

# 解决方案：

## 使用flex-grow属性：
```
.item {
flex: 1; /* 等同于 flex: 1 1 0%; */
}
```

## 使用flex-shrink属性：
```
.item {
flex: 1 1; /* flex-basis默认为0%，所以可以省略 */
}
```
## 使用flex-basis属性：
```
.item {
flex: 1 1 0%;
}
```
以上代码表示该flex项在容器中的放大比例为1，缩小比例也为1，并且基础大小为0%。这意味着即使容器空间不足，flex项也会缩小来填满空间，且当容器有多余空间时，flex项也会放大来占满空间。