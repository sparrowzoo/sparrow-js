import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import MessageApi from "@/api/MessageApi";
import { Utils } from "@/common/lib/Utils";
import SessionMeta from "@/lib/protocol/session/SessionMeta";
import ChatUser from "@/lib/protocol/ChatUser";
import { useTranslations } from "next-intl";

interface SessionSearchProp {
  sessionKey: string;
  setSessionKey: any;
}

interface SessionListProp {
  sessionList: any;
  setSessionKey: any;
}

function SessionList(sessionListProp: SessionListProp) {
  const t = useTranslations("message-search");
  const { sessionList, setSessionKey } = sessionListProp;
  if (sessionList.length === 0) {
    return <div>{t("no-session-matched")}</div>;
  }
  return (
    <div className="w-full h-[550px] border-1 border-gray-200 rounded-md overflow-y-auto p-2">
      <h2 className="text-sm font-bold p-2">{t("select-session-title")}</h2>
      {sessionList.map((sessionMeta: SessionMeta) => (
        <div
          className="flex flex-row justify-start text-left items-center pb-2 gap-2 w-fit border-b-1 border-gray-300"
          key={sessionMeta.sessionKey}
          onClick={() => {
            setSessionKey(sessionMeta.sessionKey);
          }}
        >
          <div className="flex flex-col items-start w-30">
            <span>{sessionMeta.userName}</span>
            <span>ID:{sessionMeta.userId}</span>
            <span className={"truncate w-30"}>{sessionMeta.userNickName}</span>
          </div>
          <span className={"w-4 text-center"}>-</span>
          <div className="flex flex-col items-start w-30">
            <span>{sessionMeta.oppositeName}</span>
            <span>ID:{sessionMeta.oppositeId}</span>
            <span className={"truncate w-30"}>
              {sessionMeta.oppositeNickName}
            </span>
          </div>
          <span className="w-40">
            {t("at")}：{Utils.dateFormat(sessionMeta.gmtCreate)}
          </span>{" "}
          {t("session")}
        </div>
      ))}
    </div>
  );
}

export default function SessionSearch(sessionSearchProp: SessionSearchProp) {
  const t = useTranslations("message-search");

  const { sessionKey, setSessionKey } = sessionSearchProp;
  const [sessionList, setSessionList] = useState<SessionMeta[]>([]);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userNickName, setUserNickName] = useState("");
  const loginUser = ChatUser.getCurrentUser();

  function searchSession() {
    MessageApi.querySessions(userId, userName, userNickName).then(
      (sessions) => {
        setSessionList(sessions);
      }
    );
  }

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <Input
            className={"w-30"}
            placeholder={t("session-placeholder")}
            value={sessionKey}
            onChange={(event) => {
              setSessionKey(event.target.value);
            }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-fit border-1 border-gray-300 rounded-md p-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className={"flex flex-row gap-2 w-120"}>
                {loginUser?.isAdmin() && (
                  <Input
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                    placeholder={t("user-id")}
                  />
                )}
                <Input
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                  placeholder={t("user-name")}
                />
                <Input
                  value={userNickName}
                  onChange={(event) => setUserNickName(event.target.value)}
                  placeholder={t("user-nickname")}
                />
                <Button onClick={searchSession}>
                  <SearchIcon />
                </Button>
              </div>
            </div>
          </div>
          <SessionList
            sessionList={sessionList}
            setSessionKey={setSessionKey}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
