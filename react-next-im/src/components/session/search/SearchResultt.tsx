import React from "react";
import HistoryMessageWrap from "@/lib/protocol/HistoryMessageWrap";
import HistoryMessageItem from "@/components/session/search/HistoryMessageItem";

interface SearchResultProps {
  messageWrap: HistoryMessageWrap;
  handleSearch: (sessionKey: string, lastIndex: number) => void;
}

export default function SearchResult(searchResultProps: SearchResultProps) {
  const { messageWrap, handleSearch } = searchResultProps;
  if (!messageWrap || messageWrap.historyMessages.length === 0) {
    return <div>No results found</div>;
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
