import React, { ChangeEvent, MouseEventHandler, useEffect, useRef, useState } from "react";
import AvatarEditor, { Position } from "@/components/ui/avatar-editor";
import Dropzone from "react-dropzone";
import { ImageCropperParam } from "@/api/uploader";
import AvatarState, { initialState } from "@/components/avatar/state";
import { useLoginUser } from "@/common/lib/LoginUserProvider";
import { Eye, RotateCcw, RotateCw, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import styles from "@/components/passport/passport.module.css";

interface UploadProps {
  saveAvatar: (base64: string, clientFileName: string, crop: ImageCropperParam) => void;
}

const DEFAULT_AVATAR = "/avatar.jpg";

const readAsDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });

interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const prepareUpload = async (
  dataUrl: string,
  rotate: number,
  rect: CropRect
): Promise<{base64: string; crop: ImageCropperParam}> => {
  const img = await loadImage(dataUrl);
  const W = img.naturalWidth;
  const H = img.naturalHeight;

  const px = rect.x * W;
  const py = rect.y * H;
  const pw = rect.width * W;
  const ph = rect.height * H;

  const stripPrefix = (s: string) => s.substring(s.indexOf(",") + 1);

  if (!rotate) {
    return {
      base64: stripPrefix(dataUrl),
      crop: {
        x: Math.round(px),
        y: Math.round(py),
        width: Math.round(pw),
        height: Math.round(ph),
      },
    };
  }

  const cx = px + pw / 2;
  const cy = py + ph / 2;
  const rad = (rotate * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const rot = (dx: number, dy: number): [number, number] => [
    dx * cos - dy * sin,
    dx * sin + dy * cos,
  ];

  const hw = pw / 2;
  const hh = ph / 2;
  const cCorners = [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]].map(
    ([dx, dy]) => rot(dx, dy)
  );
  const rw =
    Math.max(...cCorners.map((p) => p[0])) - Math.min(...cCorners.map((p) => p[0]));
  const rh =
    Math.max(...cCorners.map((p) => p[1])) - Math.min(...cCorners.map((p) => p[1]));

  const oCorners = [
    [-cx, -cy],
    [W - cx, -cy],
    [W - cx, H - cy],
    [-cx, H - cy],
  ].map(([dx, dy]) => rot(dx, dy));
  const minOx = Math.min(...oCorners.map((p) => p[0]));
  const maxOx = Math.max(...oCorners.map((p) => p[0]));
  const minOy = Math.min(...oCorners.map((p) => p[1]));
  const maxOy = Math.max(...oCorners.map((p) => p[1]));
  const bw = Math.ceil(maxOx - minOx);
  const bh = Math.ceil(maxOy - minOy);

  const canvas = document.createElement("canvas");
  canvas.width = bw;
  canvas.height = bh;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("no canvas context");
  }
  ctx.translate(bw / 2, bh / 2);
  ctx.rotate(rad);
  ctx.translate(-cx, -cy);
  ctx.drawImage(img, 0, 0);

  const data = canvas.toDataURL();
  return {
    base64: stripPrefix(data),
    crop: {
      x: Math.max(0, Math.round(bw / 2 - rw / 2)),
      y: Math.max(0, Math.round(bh / 2 - rh / 2)),
      width: Math.min(Math.round(rw), bw),
      height: Math.min(Math.round(rh), bh),
    },
  };
};

const AvatarCutter = (uploadProps: UploadProps) => {
  const t = useTranslations("AvatarUploader");
  const { user } = useLoginUser();

  const editor = useRef<AvatarEditor>(null);
  const [state, setState] = useState<AvatarState>(() => ({
    ...initialState,
    image: DEFAULT_AVATAR,
  }));
  const [clientName, setClientName] = useState<string>("");

  useEffect(() => {
    if (!user) {
      return;
    }
    const avatarUrl = user.getAvatar();
    setState((prev) =>
      prev.image.startsWith("data:") ? prev : { ...prev, image: avatarUrl }
    );
    fetch(avatarUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error("fetch avatar failed");
        }
        return res.blob();
      })
      .then(readAsDataUrl)
      .then((dataUrl) => {
        setState((prev) =>
          prev.image === avatarUrl ? { ...prev, image: dataUrl } : prev
        );
      })
      .catch(() => {
        // 加载失败保留 URL，保存时再给明确错误
      });
  }, [user]);

  async function localSaveAvatar() {
    if (!state.image.startsWith("data:")) {
      toast.error(
        `${t(
          state.image === DEFAULT_AVATAR ? "image_not_found" : "avatar_load_failed"
        )}`
      );
      return;
    }
    const rect = editor.current?.getCroppingRect();
    if (!rect) {
      toast.error(`${t("image_not_found")}`);
      return;
    }
    const { base64, crop } = await prepareUpload(state.image, state.rotate, rect);
    uploadProps.saveAvatar(base64, clientName, crop);
  }

  const applyFile = (file: File) => {
    setClientName(file.name);
    readAsDataUrl(file).then((dataUrl) => {
      setState((prev) => ({ ...prev, image: dataUrl }));
    });
  };

  const preview = () => {
    try {
      const img = editor.current?.getImageScaledToCanvas().toDataURL();
      const rect = editor.current?.getCroppingRect();

      if (!img || !rect) return;

      setState((prev) => ({
        ...prev,
        preview: {
          img,
          rect,
          scale: prev.scale,
          width: prev.width,
          height: prev.height,
          borderRadius: prev.borderRadius,
        },
      }));
    } catch {
      // 跨域头像（无 CORS）会污染 canvas，toDataURL 抛 SecurityError，跳过预览即可
    }
  };

  const handleImageReady = () => {
    preview();
  };

  const handleScale = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, scale: parseFloat(e.target.value) });
  };

  const rotateScale = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setState({ ...state, rotate: parseFloat(e.target.value) });
  };

  const rotateLeft: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setState({ ...state, rotate: (state.rotate - 90) % 360 });
  };

  const rotateRight: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setState({ ...state, rotate: (state.rotate + 90) % 360 });
  };

  const handleBorderRadius = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, borderRadius: parseInt(e.target.value) });
  };

  const handleWidth = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, width: parseInt(e.target.value) });
  };

  const handleHeight = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, height: parseInt(e.target.value) });
  };

  const handleShowGrid = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, showGrid: e.target.checked });
  };

  const handlePositionChange = (position: Position) => {
    setState({ ...state, position });
  };

  const setBackgroundColor = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, backgroundColor: e.target.value });
  };

  const handleBorderColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, borderColor: e.target.value });
  };

  const handleBorderOpacity = (e: ChangeEvent<HTMLInputElement>) => {
    const opacity = parseInt(e.target.value).toString(16).padStart(2, "0");
    setState({ ...state, borderColor: state.borderColor.slice(0, 7) + opacity });
  };

  const handleLoadFailure = () => {
    setState((prev) =>
      prev.image === DEFAULT_AVATAR ? prev : { ...prev, image: DEFAULT_AVATAR }
    );
  };

  function hexToRgba(hex: string): [number, number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = hex.length === 9 ? parseInt(hex.slice(7, 9), 16) / 255 : 1;
    return [r, g, b, a];
  }

  return (
    <div className={styles.avatarEditor}>
      <div className={styles.editorStage}>
        <div className={styles.stageCanvas}>
          <Dropzone
            onDrop={([image]) => image && applyFile(image)}
            noClick
            multiple={false}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <AvatarEditor
                  ref={editor}
                  scale={state.scale}
                  width={state.width}
                  height={state.height}
                  position={state.position}
                  showGrid={state.showGrid}
                  onPositionChange={handlePositionChange}
                  rotate={state.rotate}
                  borderRadius={state.width / (100 / state.borderRadius)}
                  backgroundColor={state.backgroundColor}
                  onLoadFailure={handleLoadFailure}
                  onImageReady={handleImageReady}
                  crossOrigin="anonymous"
                  image={state.image}
                  disableCanvasRotation={state.disableCanvasRotation}
                  borderColor={hexToRgba(state.borderColor)}
                />
                <input
                  {...getInputProps()}
                  accept="image/*"
                  id="imgAvatarUploader"
                  type="file"
                />
              </div>
            )}
          </Dropzone>
        </div>
        <div className={styles.stageHint}>
          <span>{t("dragging-image-to-upload")}</span>
          <span>{t("or")}</span>
          <label className={styles.uploadLabel} htmlFor="imgAvatarUploader">
            <Upload size={14} aria-hidden="true" />
            {t("upload-image")}
          </label>
        </div>
      </div>

      <div className={styles.editorPanel}>
        <div className={styles.panelCard}>
          <div className={styles.panelEyebrow}>
            <span />
            {t("preview")}
          </div>
          <div className={styles.previewBox}>
            <div
              className={styles.previewAvatar}
              style={{ borderRadius: `${(132 * state.borderRadius) / 100}px` }}
            >
              {state.preview ? (
                <img alt="" src={state.preview.img} />
              ) : (
                <span className={styles.previewEmpty}>{t("preview")}</span>
              )}
            </div>
            <button
              type="button"
              className={styles.secondaryButton}
              style={{ width: "100%" }}
              onClick={preview}
            >
              <Eye size={15} aria-hidden="true" />
              {t("preview")}
            </button>
          </div>
        </div>

        <div className={styles.panelCard}>
          <div className={styles.panelEyebrow}>
            <span />
            {t("settings")}
          </div>
          <div className={styles.settingsGroup}>
            <div className={styles.settingsRow}>
              <span className={styles.settingsLabel}>{t("width")}</span>
              <input
                className={styles.range}
                type="range"
                min={200}
                max={600}
                step={10}
                value={state.width}
                onChange={handleWidth}
                aria-label={t("width")}
              />
            </div>
            <div className={styles.settingsRow}>
              <span className={styles.settingsLabel}>{t("height")}</span>
              <input
                className={styles.range}
                type="range"
                min={200}
                max={600}
                step={10}
                value={state.height}
                onChange={handleHeight}
                aria-label={t("height")}
              />
            </div>
            <div className={styles.settingsRow}>
              <span className={styles.settingsLabel}>{t("scale")}</span>
              <input
                className={styles.range}
                type="range"
                min={state.allowZoomOut ? 0.1 : 1}
                max={2}
                step={0.01}
                value={state.scale}
                onChange={handleScale}
                aria-label={t("scale")}
              />
            </div>
            <div className={styles.settingsRow}>
              <span className={styles.settingsLabel}>{t("rotate-scale")}</span>
              <input
                className={styles.range}
                type="range"
                min={0}
                max={360}
                step={1}
                value={state.rotate}
                onChange={rotateScale}
                aria-label={t("rotate-scale")}
              />
              <button
                type="button"
                className={styles.iconButton}
                onClick={rotateLeft}
                aria-label="rotate left"
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                className={styles.iconButton}
                onClick={rotateRight}
                aria-label="rotate right"
              >
                <RotateCw size={15} />
              </button>
            </div>
            <div className={styles.settingsRow}>
              <span className={styles.settingsLabel}>{t("border-radius")}</span>
              <input
                className={styles.range}
                type="range"
                min={0}
                max={50}
                step={1}
                value={state.borderRadius}
                onChange={handleBorderRadius}
                aria-label={t("border-radius")}
              />
            </div>
            <div className={styles.settingsRow}>
              <span className={styles.settingsLabel}>{t("show-grid")}</span>
              <span className={styles.switch}>
                <input
                  type="checkbox"
                  checked={state.showGrid}
                  onChange={handleShowGrid}
                  id="avatarShowGrid"
                />
                <span className={styles.switchTrack} />
              </span>
            </div>

            {state.isTransparent && (
              <>
                <div className={styles.settingsRow}>
                  <span className={styles.settingsLabel}>
                    {t("background-color")}
                  </span>
                  <input
                    className={styles.colorInput}
                    type="color"
                    value={state.backgroundColor || "#ffffff"}
                    onChange={setBackgroundColor}
                    aria-label={t("background-color")}
                  />
                </div>
                <div className={styles.settingsRow}>
                  <span className={styles.settingsLabel}>
                    {t("border-color")}
                  </span>
                  <input
                    className={styles.colorInput}
                    type="color"
                    value={state.borderColor.slice(0, 7)}
                    onChange={handleBorderColorChange}
                    aria-label={t("border-color")}
                  />
                  <input
                    className={styles.range}
                    type="range"
                    min={0}
                    max={255}
                    value={parseInt(state.borderColor.slice(7, 9), 16)}
                    onChange={handleBorderOpacity}
                    aria-label={t("opacity")}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={localSaveAvatar}
        >
          {t("save")}
        </button>
      </div>
    </div>
  );
};
export default AvatarCutter;
