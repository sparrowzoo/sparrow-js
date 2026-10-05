"use client";
import dynamic from "next/dynamic";
import { Uploader } from "@/api/uploader";
import { useTranslations } from "next-intl";
import useNavigating from "@/common/hook/NavigatingHook";
import toast from "react-hot-toast";
import styles from "@/components/passport/passport.module.css";

const AvatarCutter = dynamic(() => import("@/components/avatar/AvatarCutter"), {ssr: false});

export default function AvatarEditorPage() {
  const t = useTranslations("AvatarUploader");
  const ui = useTranslations("Passport.ui");
  const Navigations = useNavigating();

  function handleUpload(image: string, clientFileName: string) {
    const base64String = image.split(",")[1]; // 去掉前缀
    Uploader.uploadAvatar(base64String, clientFileName, t).then((res) => {
      toast.success(t("upload-success"));
      Navigations.redirectToIndex();
    });
  }

  return <section className={styles.accountPage}>
    <div className={styles.accountHeading}><p className={styles.eyebrow}>SPARROW ID / PROFILE</p><h1>{ui("avatarTitle")}</h1><p>{ui("avatarDescription")}</p></div>
    <div className={styles.avatarPanel}><AvatarCutter saveAvatar={handleUpload}/></div>
  </section>;
}
