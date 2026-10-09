import { format } from "util";
import { NEXT_ASSET_PREFIX } from "@/common/lib/Env";

function icon(fileUrl: string) {
  const styleText = 'style="width: 128px; height: 128px;"';
  const splitArray = fileUrl.split(".");
  const extension = splitArray[splitArray.length - 1];
  switch (extension) {
    case "doc":
    case "docx":
      return format(
        '<img %s src="%s" alt="Word" />',
        styleText,
        NEXT_ASSET_PREFIX + "/icon/doc.png"
      );
    case "xls":
    case "xlsx":
      return format(
        '<img %s src="%s" alt="Excel" />',
        styleText,
        NEXT_ASSET_PREFIX + "/icon/xls.png"
      );

    case "pdf":
      return format(
        '<img %s src="%s" alt="PDF" />',
        styleText,
        NEXT_ASSET_PREFIX + "/icon/pdf.png"
      );
    case "zip":
    case "rar":
      return format(
        '<img %s src="%s" alt="RAR/ZIP" />',
        styleText,
        NEXT_ASSET_PREFIX + "/icon/rar.png"
      );
    default:
      return format(
        '<img %s src="%s" alt="File" />',
        styleText,
        NEXT_ASSET_PREFIX + "/icon/other.png"
      );
  }
}

function getDownloadShower(fileUrl: string, fileName: string) {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.target = "_blank";
  link.style.display = "block";
  link.innerHTML = icon(fileUrl) + "【" + fileName + "】";
  return link;
}

function insertElement(editor: HTMLElement, insertableElement: HTMLElement) {
  if (editor === null) {
    return;
  }
  editor.focus();

  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);
  range?.insertNode(insertableElement);
  const newRange = document.createRange();
  newRange.setStartAfter(insertableElement);
  newRange.collapse(true);
  selection?.removeAllRanges();
  selection?.addRange(newRange);
}

export { getDownloadShower, insertElement };
