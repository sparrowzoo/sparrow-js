import React, { useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

interface SenderProps {
  sendMessage: (message: string) => void;
}

export default function MessageEditor(senderProps: SenderProps) {
  const { sendMessage } = senderProps;
  const [message, setMessage] = useState<string>("");

  async function localSendMessage() {
    if (message.trim() === "") {
      toast.error("别发空消息呀");
      return;
    }
    sendMessage(message.trim());
    setMessage("");
  }

  return (
    <>
      <textarea
        value={message}
        onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (event.code === "Enter") {
            localSendMessage();
          }
        }}
        onChange={(event) => setMessage(event.target.value)}
        className={
          "w-full shrink-0  h-[25rem] border border-gray-300 rounded-md p-2"
        }
      ></textarea>

      <div
        className={
          "flex shrink-0 h-[2rem] flex-row items-center justify-center mt-4"
        }
      >
        <button
          className={
            "flex flex-row items-center justify-center w-1/6 cursor-pointer bg-gray-500 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
          }
          onClick={(event) => localSendMessage()}
        >
          发送
          <Send />
        </button>
      </div>
    </>
  );
}
