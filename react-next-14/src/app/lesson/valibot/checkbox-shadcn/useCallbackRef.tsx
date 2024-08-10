import * as React from 'react';

/**
 * A custom hook that converts a callback to a ref to avoid triggering re-renders when passed as a
 * prop or avoid re-executing effects when passed as a dependency
 *
 * ? facebook useCallback hook 实现相同的功能
 * 区别:
 * 1. 官方实现需要依赖dependency 对于用户来讲有心智负责，而且对于组件来讲，组件不知道具体的依赖，所以无法使用官方的版本实现
 * 2. 自定义实现不需要依赖，只需要保证每次渲染时，callbackRef.current 都指向最新的callback，这样就能保证组件不重新渲染，也能保证effect不重新执行（可能有性能问题）
 * VS
 * 官方实现版本性能较好，但是用户需要自己保证依赖，并且组件不知道具体的依赖，不够灵活
 * 自定义实现版本性能较差，但是用户不需要自己保证依赖，组件可以知道具体的依赖，灵活性更高
 *
 */
function useCallbackRef<T extends (...args: any[]) => any>(callback: T | undefined): T {
  const callbackRef = React.useRef(callback);
  React.useEffect(() => {
    callbackRef.current = callback;
  });
  // https://github.com/facebook/react/issues/19240
  return React.useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, []);
}

export { useCallbackRef };
