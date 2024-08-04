# Promise
https://www.promisejs.org/

We use new Promise to construct the promise. We give the constructor a factory function which does the actual work. This function is called immediately with two arguments. The first argument fulfills the promise and the second argument rejects the promise. Once the operation has completed, we call the appropriate function.


https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise


以下是典型的 Promise 流程概述：

- 在构造函数生成新的 Promise 对象时，它还会生成一对相应的 resolveFunc 和 rejectFunc 函数；它们与 Promise 对象“绑定”在一起。
- executor 通常会封装某些提供基于回调的 API 的异步操作。回调函数（传给原始回调 API 的函数）在 executor 代码中定义，因此它可以访问 resolveFunc 和 rejectFunc。
- executor 是同步调用的（在构造 `Promise 时立即调用`），并将 resolveFunc 和 rejectFunc 函数作为传入参数。
- executor 中的代码有机会执行某些操作。异步任务的最终完成通过 resolveFunc 或 rejectFunc 引起的副作用与 Promise 实例进行通信。这个副作用让 Promise 对象变为“已解决”状态。
如果先调用 resolveFunc，则传入的值将解决。Promise 可能会保持待定状态（如果传入了另一个 thenable 对象），变为已兑现状态（在传入非 thenable 值的大多数情况下），或者变为已拒绝状态（在解析值无效的情况下）。
如果先调用 rejectFunc，则 Promise 立即变为已拒绝状态。
- 一旦 resolveFunc 或 rejectFunc 中的一个被调用，Promise 将保持解决状态。只有第一次调用 resolveFunc 或 rejectFunc 会影响 Promise 的最终状态，随后对任一函数的调用都不能更改兑现值或拒绝原因，也不能将其最终状态从“已兑现”转换为“已拒绝”或相反。
如果 executor 抛出错误，则 Promise 被拒绝。但是，如果 resolveFunc 或 rejectFunc 中的一个已经被调用（因此 Promise 已经被解决），则忽略该错误。
解决 Promise 不一定会导致 Promise 变为已兑现或已拒绝（即已敲定）。Promise 可能仍处于待定状态，因为它可能是用另一个 thenable 对象解决的，但它的最终状态将与已解决的 thenable 对象一致。
一旦 Promise 敲定，它会（异步地）调用任何通过 then()、catch() 或 finally() 关联的进一步处理程序。最终的兑现值或拒绝原因在调用时作为输入参数传给兑现和拒绝处理程序（请参阅 promise 的链式调用）。