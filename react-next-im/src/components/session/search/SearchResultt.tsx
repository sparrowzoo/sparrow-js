import React from "react";
import HistoryMessageWrap from "@/lib/protocol/HistoryMessageWrap";
import HistoryMessageItem from "@/components/session/search/HistoryMessageItem";
import { useTranslations } from "next-intl";

interface SearchResultProps {
  messageWrap: HistoryMessageWrap;
  handleSearch: (sessionKey: string, lastIndex: number) => void;
}

export default function SearchResult(searchResultProps: SearchResultProps) {
  const t = useTranslations("message-search");

  const { messageWrap, handleSearch } = searchResultProps;
  if (!messageWrap || messageWrap.historyMessages.length === 0) {
    return <></>;
  }
  return (
    <div className={"w-full"}>
      {messageWrap.historyMessages.map((message, index) => (
        <HistoryMessageItem
          handleSearch={handleSearch}
          messageWrap={messageWrap}
          key={message.messageId}
          message={message}
        />
      ))}
    </div>
  );
}
