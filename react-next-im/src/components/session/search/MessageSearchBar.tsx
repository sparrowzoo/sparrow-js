import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import SessionSearch from "@/components/session/search/SesssionSearch";
import React, { useState } from "react";
import BeginEndDatePicker from "@/components/BeginEndDatePicker";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import MessageApi from "@/api/MessageApi";
import HistoryMessageWrap from "@/lib/protocol/HistoryMessageWrap";
import SearchResult from "@/components/session/search/SearchResultt";
import ThreeDotLoading from "@/common/components/ThreeDotLoading";
import useReachBottom from "@/common/hook/ReachBottomHook";

export default function MessageSearchBar() {
  const [sessionKey, setSessionKey] = useState("");
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [content, setContent] = useState("");
  const [messageWrap, setMessageWrap] = useState<HistoryMessageWrap>();
  const reachBottomHandler = (lastId: number) => {
    console.log("sessionKey" + sessionKey + ",lastId " + lastId);
    return handleSearch(sessionKey, lastId);
  };
  const { loading, startLoading, lastId, finishLoading, containerRef } =
    useReachBottom(reachBottomHandler, 0);

  function handleSearch(localSessionKey: string, localLastId: number) {
    if (localLastId == -1) {
      return Promise.resolve(-1);
    }
    setSessionKey(localSessionKey);
    startLoading();
    const beginDate = format(date?.from as Date, "yyyy-MM-dd");
    const endDate = format(date?.to as Date, "yyyy-MM-dd");
    return MessageApi.queryMessages(
      localSessionKey,
      content,
      beginDate,
      endDate,
      localLastId
    ).then((currentHistoryMessageWrap) => {
      //将历史消息合并
      let mergedMessageWrap = messageWrap as HistoryMessageWrap;
      if (!mergedMessageWrap || localLastId == 0) {
        mergedMessageWrap = new HistoryMessageWrap();
      }
      mergedMessageWrap.historyMessages.push(
        ...currentHistoryMessageWrap.historyMessages
      );
      const remoteQunMaps = currentHistoryMessageWrap.qunMaps;
      const remoteUserMap = currentHistoryMessageWrap.userMap;
      for (const [groupId, group] of remoteQunMaps) {
        mergedMessageWrap.qunMaps.set(groupId, group);
      }
      for (const [userId, user] of remoteUserMap) {
        mergedMessageWrap.userMap.set(userId, user);
      }
      setMessageWrap(mergedMessageWrap);
      if (currentHistoryMessageWrap.historyMessages.length > 0) {
        const lastMessageId = parseInt(
          currentHistoryMessageWrap.historyMessages[
            currentHistoryMessageWrap.historyMessages.length - 1
          ].messageId,
          10
        );
        console.log("fetch done with lastId", lastMessageId);
        finishLoading(lastMessageId);
        return lastMessageId;
      } else {
        finishLoading(-1);
        return -1;
      }
    });
  }

  return (
    <div className={"flex flex-col"}>
      <div className={"flex flex-row w-150"}>
        <SessionSearch sessionKey={sessionKey} setSessionKey={setSessionKey} />
        <BeginEndDatePicker date={date} setDate={setDate} />
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={"content"}
        />

        <Button
          onClick={() => {
            handleSearch(sessionKey, 0);
          }}
        >
          <SearchIcon />
        </Button>
      </div>
      <div
        ref={containerRef}
        className={
          "w-full h-[550px] border-1 border-gray-200 rounded-md overflow-y-auto"
        }
      >
        <SearchResult
          messageWrap={messageWrap as HistoryMessageWrap}
          handleSearch={handleSearch}
        />
        {loading && <ThreeDotLoading />}
        {lastId == -1 && (
          <div className={"text-center text-gray-500 mt-4"}>没有更多消息了</div>
        )}
      </div>
    </div>
  );
}
