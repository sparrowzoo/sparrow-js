// 触底检测函数
import { useEffect, useRef, useState } from "react";

export default function useReachBottom(
  reachBottomHandler: (lastId: any) => Promise<any>,
  initialLastId: any
) {
  const [loading, setLoading] = useState(false);
  const globalLoading = useRef(false);
  const [lastId, setLastId] = useState<any>(initialLastId);
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

  function finishLoading(newLastId: any) {
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
    const handleScroll = () => {
      if (!checkScrollBottom()) {
        return;
      }
      if (globalLoading.current) {
        console.log("ignore reachBottomHandler event" + globalLoading.current);
        return;
      }
      startLoading();
      reachBottomHandler(lastId).then((newLastId: any) => {
        finishLoading(newLastId);
      });
    };
    containerRef.current &&
      containerRef.current.addEventListener("scroll", handleScroll);
    return () => {
      containerRef.current &&
        containerRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [loading]); //每次请求都重新绑定参数，避免闭包缓存
  return {
    loading,
    startLoading,
    finishLoading,
    lastId,
    setLastId,
    containerRef,
  };
}
