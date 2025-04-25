"use client";
import dynamic from "next/dynamic";
import { Uploader } from "@/api/uploader";

export default function AvatarEditorPage() {
  function handleUpload(image: string, clientFileName) {
    const base64String = image.split(",")[1]; // 去掉前缀
    Uploader.uploadAvatar(base64String, clientFileName);
  }

  const AvatarCutter = dynamic(
    () => import("@/components/avatar/AvatarCutter"),
    {
      ssr: false,
    }
  );
  return <AvatarCutter saveAvatar={handleUpload} />;
}
