// 触底检测函数
import {useEffect, useRef, useState} from "react";

const checkScrollBottom = () => {
    const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
    const threshold = 100; // 距离底部100px触发
    return scrollTop + clientHeight >= scrollHeight - threshold;
};


export default function useReachBottom(reachBottomHandler: (lastId: any) => Promise<any>, initialLastId: any) {
    const [loading, setLoading] = useState(false);
    const globalLoading = useRef(false);
    const [lastId, setLastId] = useState<any>(initialLastId);

    // 滚动事件处理（带防抖）
    useEffect(() => {
        const handleScroll = () => {
            if (!checkScrollBottom()) {
                return;
            }
            if (globalLoading.current) {
                console.log("ignore reachBottomHandler event" + globalLoading.current);
                return;
            }
            globalLoading.current = true;
            console.log("reachBottomHandler", loading);
            setLoading(true);
            reachBottomHandler(lastId).then((newLastId: any) => {
                setLoading(false);
                globalLoading.current = false;
                setLastId(newLastId);
            });
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return {loading, setLoading, lastId, setLastId};
}
