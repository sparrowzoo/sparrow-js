import React from "react";
import { FileUp, ImageUp, Send } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/file/FileUploader";
import { getDownloadShower, insertElement } from "@/components/file/FileUtils";
import { UPLOAD_URL } from "@/common/lib/Env";

interface SenderProps {
  sendMessage: (message: string) => void;
}

export default function MessageEditor(senderProps: SenderProps) {
  const { sendMessage } = senderProps;
  const [message, setMessage] = React.useState("");
  const editorRef = React.createRef<HTMLDivElement>();
  const uploadUrl = `${UPLOAD_URL}`;

  async function localSendMessage() {
    const message = editorRef.current?.innerHTML;
    if (message === undefined || message.trim() === "") {
      toast.error("别发空消息呀");
      return;
    }
    sendMessage(message.trim());
    setMessage("");
  }

  function insertImage(url: string, fileName: string) {
    const editor = editorRef.current;
    if (editor === null) {
      return;
    }
    editor.focus();
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";

    const img = document.createElement("img");
    img.src = url;
    img.style.display = "block";
    img.style.maxWidth = "300px";
    img.style.display = "block";
    a.appendChild(img);
    insertElement(editor, a);
  }

  function insertFile(url: string, fileName: string) {
    const editor = editorRef.current;
    if (editor === null) {
      return;
    }
    editor.focus();
    const a = getDownloadShower(url, fileName);
    insertElement(editor, a);
  }

  return (
    <div className="flex flex-col w-full h-fit">
      <div className="flex flex-row items-center justify-start h-[3rem] pl-2 gap-4 border-t-1 border-l-1 border-r-1 border-solid border-gray-500 rounded-t-md ">
        <FileUploader
          url={uploadUrl}
          id={"fileUploader"}
          uploadIcon={<FileUp className={"bg-background"} />}
          uploadCallback={insertFile}
        />
        <FileUploader
          url={uploadUrl}
          id={"imgUploader"}
          uploadIcon={<ImageUp className={"bg-background"} />}
          uploadCallback={insertImage}
        />
      </div>
      <div
        ref={editorRef}
        contentEditable={"true"}
        dangerouslySetInnerHTML={{ __html: message }}
        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.code === "Enter") {
            event.preventDefault(); // 阻止默认分段行为
            localSendMessage();
          }
        }}
        className={
          "text-xs w-full overflow-y-scroll border-1 border-solid border-gray-500 rounded-b-md text-left shrink-0  h-[12rem] p-2"
        }
      ></div>

      <div
        className={
          "flex shrink-0 h-[2rem] flex-row items-center justify-center m-2"
        }
      >
        <Button
          className={"cursor-pointer"}
          onClick={(event) => localSendMessage()}
        >
          发送
          <Send />
        </Button>
      </div>
    </div>
  );
}
