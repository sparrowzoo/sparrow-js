import Fetcher from "@/common/lib/Fetcher";
import CrosStorage from "@/common/lib/CrosStorage";
import Result from "@/common/lib/protocol/Result";
import toast from "react-hot-toast";
import { redirectToIndex } from "@/common/lib/Navigating";

export class Uploader {
  public static uploadAvatar(base64: string, clientFileName: string) {
    const body = {
      pathKey: "avatar",
      clientFileName: clientFileName,
      base64Content: base64,
    };
    return Fetcher.post(
      "/base64-upload.json",
      body,
      CrosStorage.getCrosStorage()
    ).then((result: Result) => {
      toast.success("头像上传成功！老帅了吧!");
      redirectToIndex();
    });
  }
}
