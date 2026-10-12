"use client";
import dynamic from "next/dynamic";
import { Uploader, ImageCropperParam } from "@/api/uploader";
import { useTranslations } from "next-intl";
import useNavigating from "@/common/hook/NavigatingHook";
import LoginUser from "@/common/lib/protocol/LoginUser";
import toast from "react-hot-toast";
import styles from "@/components/passport/passport.module.css";

const AvatarCutter = dynamic(() => import("@/components/avatar/AvatarCutter"), {ssr: false});

export default function AvatarEditorPage() {
  const t = useTranslations("AvatarUploader");
  const ui = useTranslations("Passport.ui");
  const Navigations = useNavigating();

  function handleUpload(base64: string, clientFileName: string, crop: ImageCropperParam) {
    Uploader.uploadAvatar(base64, clientFileName, crop, t).then((url) => {
      // 头像 URL 路径通常不变，浏览器会命中缓存显示旧图，追加随机参数强制刷新
      const avatar = `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`;
      LoginUser.updateAvatar(avatar);
      toast.success(t("upload-success"));
      Navigations.redirectToIndex();
    });
  }

  return <section className={styles.accountPage}>
    <div className={styles.accountHeading}>
      <p className={styles.eyebrow}><span />SPARROW ID / PROFILE</p>
      <h1>{ui("avatarTitle")}</h1>
      <p>{ui("avatarDescription")}</p>
    </div>
    <AvatarCutter saveAvatar={handleUpload}/>
  </section>;
}
