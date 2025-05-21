"use client";
import dynamic from "next/dynamic";
import { Uploader } from "@/api/uploader";
import { useTranslations } from "next-intl";
import useNavigating from "@/common/hook/NavigatingHook";
import toast from "react-hot-toast";

export default function AvatarEditorPage() {
  const t = useTranslations("AvatarUploader");
  const Navigations = useNavigating();

  function handleUpload(image: string, clientFileName) {
    const base64String = image.split(",")[1]; // 去掉前缀
    Uploader.uploadAvatar(base64String, clientFileName, t).then((res) => {
      toast.success(t("upload-success"));
      Navigations.redirectToIndex();
    });
  }

  const AvatarCutter = dynamic(
    () => import("@/components/avatar/AvatarCutter"),
    {
      ssr: false,
    }
  );
  return <AvatarCutter saveAvatar={handleUpload} />;
}
