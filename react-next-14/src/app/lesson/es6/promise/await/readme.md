# Promise and Async/Await

正常情况下Promise 后的await后的语句被阻塞
(但仅限于当前方法，方法之后外的代码不会被阻塞)

Effect hook 里的的逻辑不允许使用await，因为它会阻塞组件的渲染。

# 总结

由于 useEffect 是在函数式组件中承担执行副作用操作的职责，
它的返回值的执行操作应该是可以预期的，
而不能是一个异步函数，所以不支持回调函数 async...await 的写法。

我们可以将 async...await 的逻辑封装在 useEffect 回调函数的内部，
我们的清除机制不应该依赖于异步函数，否则很容易出现难以定位的 bug。

https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30551