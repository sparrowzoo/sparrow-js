// 触底检测函数
import { useEffect, useRef, useState } from "react";

export default function useReachBottom<T>(
  reachBottomHandler: (lastId: T) => Promise<T>,
  initialLastId: T
) {
  const [loading, setLoading] = useState(false);
  const globalLoading = useRef(false);
  const [lastId, setLastId] = useState<T>(initialLastId);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkScrollBottom = () => {
    if (!containerRef.current) {
      return false;
    }
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const threshold = 20; // 距离底部100px触发
    return scrollTop + clientHeight >= scrollHeight - threshold;
  };

  function startLoading() {
    globalLoading.current = true;
    console.log("reachBottomHandler", loading);
    setLoading(true);
  }

  function finishLoading(newLastId: T) {
    setLoading(false);
    // 延迟1秒，防止短时间内多次触发reachBottomHandler
    setTimeout(() => {
      globalLoading.current = false;
    }, 100);
    setLastId(newLastId);
  }

  // 滚动事件处理（带防抖）
  useEffect(() => {
    console.log("重新装裁 scroll", lastId);
    const node = containerRef.current;
    const handleScroll = () => {
      if (!checkScrollBottom()) {
        return;
      }
      if (globalLoading.current) {
        console.log("ignore reachBottomHandler event" + globalLoading.current);
        return;
      }
      startLoading();
      reachBottomHandler(lastId).then((newLastId) => {
        finishLoading(newLastId);
      });
    };
    node?.addEventListener("scroll", handleScroll);
    return () => {
      node?.removeEventListener("scroll", handleScroll);
    };
    // 每次请求都重新绑定参数，避免闭包缓存（避免闭包捕获旧的 lastId）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);
  return {
    loading,
    startLoading,
    finishLoading,
    lastId,
    setLastId,
    containerRef,
  };
}
