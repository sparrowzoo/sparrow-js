import Fetcher from "@/common/lib/Fetcher";

export class Uploader {
  public static uploadAvatar(
    base64: string,
    clientFileName: string,
    translator: (key: string) => string
  ) {
    const body = {
      pathKey: "avatar",
      clientFileName: clientFileName,
      base64Content: base64,
    };
    debugger;
    return Fetcher.post("/base64-upload.json", body, translator);
  }
}
