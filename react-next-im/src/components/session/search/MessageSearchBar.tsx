import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {SearchIcon} from "lucide-react";
import SessionSearch from "@/components/session/search/SesssionSearch";
import React, {useEffect, useState} from "react";
import BeginEndDatePicker from "@/components/BeginEndDatePicker";
import {DateRange} from "react-day-picker";
import {addDays, format} from "date-fns";
import MessageApi from "@/api/MessageApi";
import HistoryMessageWrap from "@/lib/protocol/HistoryMessageWrap";
import SearchResult from "@/components/session/search/SearchResultt";
import toast from "react-hot-toast";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";

export default function MessageSearchBar() {
    const [sessionKey, setSessionKey] = useState("");
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: addDays(new Date(), -7),
        to: new Date(),
    });
    const [content, setContent] = useState("");
    const [messageWrap, setMessageWrap] = useState<HistoryMessageWrap>();
    const [lastId, setLastId] = useState(0);
    const [loading, setLoading] = useState(false);
    let globalLoading = false;

    function handleSearch(localSessionKey: string, localLastId: number) {
        if (localLastId == -1) {
            toast.error("没有更多消息了");
            return;
        }
        const beginDate = format(date?.from as Date, "yyyy-MM-dd");
        const endDate = format(date?.to as Date, "yyyy-MM-dd");
        MessageApi.queryMessages(
            localSessionKey,
            content,
            beginDate,
            endDate,
            localLastId
        ).then((remoteHistoryMessageWrap) => {
            let localMessageWrap = messageWrap as HistoryMessageWrap;
            if (!localMessageWrap || localLastId == 0) {
                localMessageWrap = new HistoryMessageWrap();
            }
            localMessageWrap.historyMessages.push(...remoteHistoryMessageWrap.historyMessages);
            const remoteQunMaps = remoteHistoryMessageWrap.qunMaps;
            const remoteUserMap = remoteHistoryMessageWrap.userMap;
            for (const [groupId, group] of remoteQunMaps) {
                localMessageWrap.qunMaps.set(groupId, group);
            }
            for (const [userId, user] of remoteUserMap) {
                localMessageWrap.userMap.set(userId, user);
            }
            setMessageWrap(localMessageWrap);
            globalLoading = false;
            setLoading(false);
            if (remoteHistoryMessageWrap.historyMessages.length > 0) {
                setLastId(
                    parseInt(
                        remoteHistoryMessageWrap.historyMessages[
                        remoteHistoryMessageWrap.historyMessages.length - 1
                            ].messageId,
                        10
                    )
                );
            } else {
                setLastId(-1);
            }
        });
    }

    // 触底检测函数
    const checkScrollBottom = () => {
        console.log("checkScrollBottom");
        const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
        const threshold = 100; // 距离底部100px触发
        return scrollTop + clientHeight >= scrollHeight - threshold;
    };

    // 滚动事件处理（带防抖）
    useEffect(() => {
        const handleScroll = () => {
            if (checkScrollBottom()) {
                if (!globalLoading) {
                    globalLoading = true;
                    console.log("handler search messages", loading);
                    setLoading(globalLoading);
                    handleSearch(sessionKey, lastId);
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastId]);

    return (
        <div className={"flex flex-col"}>
            <div className={"flex flex-row w-150"}>
                <SessionSearch sessionKey={sessionKey} setSessionKey={setSessionKey}/>
                <BeginEndDatePicker date={date} setDate={setDate}/>
                <Input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={"content"}
                />

                <Button
                    onClick={() => {
                        setLastId(0);
                        handleSearch("", 0);
                    }}
                >
                    <SearchIcon/>
                </Button>
            </div>
            <div className={"w-fit"}>
                <SearchResult
                    messageWrap={messageWrap as HistoryMessageWrap}
                    handleSearch={handleSearch}
                    setSessionKey={setSessionKey}
                />
                {loading && (<ThreeDotLoading/>)}
                {lastId == -1 && (
                    <div className={"text-center text-gray-500 mt-4"}>没有更多消息了</div>
                )}
            </div>
        </div>
    );
}
