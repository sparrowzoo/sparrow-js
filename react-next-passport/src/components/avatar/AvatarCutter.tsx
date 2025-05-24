import React, { ChangeEvent, MouseEventHandler, useRef, useState } from "react";
import AvatarEditor, { Position } from "@/components/ui/avatar-editor";
import Dropzone, { useDropzone } from "react-dropzone";
import AvatarState, { initialState } from "@/components/avatar/state";
import { Button } from "@/components/ui/button";
import {
  ArrowBigUp,
  ArrowRightToLine,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { UploadIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

interface UploadProps {
  saveAvatar: (avatar: string, clientFileName: string) => void;
}

const AvatarCutter = (uploadProps: UploadProps) => {
  const t = useTranslations("AvatarUploader");

  function localSaveAvatar() {
    const img = editor.current?.getImage().toDataURL();
    editor;
    if (!img) {
      toast.error(`${t("image_not_found")}`);
      return;
    }
    uploadProps.saveAvatar(img, clientName);
  }

  const onDrop = (acceptedFiles: File[]) => {
    const fileUrl = URL.createObjectURL(acceptedFiles[0]);
    setState({ ...state, image: fileUrl });
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  //const rootProps = getRootProps();
  //const inputProps = getInputProps();
  const editor = useRef<AvatarEditor>(null);
  const [state, setState] = useState<AvatarState>(initialState);
  const [clientName, setClientName] = useState<string>("");
  const handleNewImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setClientName(e.target.files?.[0].name);
      const fileUrl = URL.createObjectURL(e.target.files?.[0]);
      setState({ ...state, image: fileUrl });
    }
  };

  const preview = () => {
    const img = editor.current?.getImageScaledToCanvas().toDataURL();
    const rect = editor.current?.getCroppingRect();

    if (!img || !rect) return;

    setState({
      ...state,
      preview: {
        img,
        rect,
        scale: state.scale,
        width: state.width,
        height: state.height,
        borderRadius: state.borderRadius,
      },
    });
  };

  const handleScale = (e: ChangeEvent<HTMLInputElement>) => {
    const scale = parseFloat(e.target.value);
    setState({ ...state, scale });
  };

  const handleAllowZoomOut = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, allowZoomOut: e.target.checked });
  };

  const handleDisableCanvasRotation = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, disableCanvasRotation: e.target.checked });
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

  const handleXPosition = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      position: { ...state.position, x: parseFloat(e.target.value) },
    });
  };

  const handleYPosition = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      position: { ...state.position, y: parseFloat(e.target.value) },
    });
  };

  const handleWidth = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, width: parseInt(e.target.value) });
  };

  const handleHeight = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, height: parseInt(e.target.value) });
  };

  const logCallback = (e: any) => {
    console.log("callback", e);
  };

  const handlePositionChange = (position: Position) => {
    setState({ ...state, position });
  };

  const setBackgroundColor = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, backgroundColor: e.target.value });
  };

  const setTransparent = (e: ChangeEvent<HTMLInputElement>) => {
    const isTransparent = e.target.checked;
    // set color to white initially
    const backgroundColor = isTransparent ? "#fff" : undefined;
    setState({ ...state, backgroundColor, isTransparent });
  };

  const handleShowGrid = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, showGrid: e.target.checked });
  };

  const handleBorderColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    debugger;
    console.log(e.target.value);
    setState({ ...state, borderColor: e.target.value });
  };

  // Helper function to convert hex color with alpha to RGBA array
  function hexToRgba(hex: string): [number, number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = hex.length === 9 ? parseInt(hex.slice(7, 9), 16) / 255 : 1;
    return [r, g, b, a];
  }

  return (
    <div>
      <div className={"flex flex-row items-center justify-start gap-4"}>
        <Dropzone
          onDrop={([image]) => {
            setClientName(image.name);
            const base64Url = URL.createObjectURL(image);
            setState({ ...state, image: base64Url });
          }}
          noClick={!state.clickable}
          multiple={false}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className="preview">
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
                onLoadFailure={logCallback.bind(this, "onLoadFailed")}
                onLoadSuccess={logCallback.bind(this, "onLoadSuccess")}
                onImageReady={logCallback.bind(this, "onImageReady")}
                image={state.image}
                disableCanvasRotation={state.disableCanvasRotation}
                borderColor={hexToRgba(state.borderColor)}
              />
              <input
                onChange={handleNewImage}
                id="imgAvatarUploader"
                type="file"
                {...getInputProps()}
              />
            </div>
          )}
        </Dropzone>
        <div>
          <Button onClick={preview}>
            {t("preview")}
            <ArrowRightToLine />
          </Button>
        </div>
        <div>
          {state.preview && (
            <>
              <img
                alt=""
                src={state.preview.img}
                style={{
                  borderRadius: `${
                    (Math.min(state.preview.height, state.preview.width) + 10) *
                    (state.preview.borderRadius / 2 / 100)
                  }px`,
                }}
              />
            </>
          )}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("settings")}</CardTitle>
          <CardDescription
            className={"flex items-center justify-start gap-2 flex-row"}
          >
            {t("dragging-image-to-upload")}
            <ArrowBigUp
              className={"bg-accent-foreground text-background"}
            />{" "}
            {t("or")} {t("click")}
            <label
              className={
                "flex flex-row items-center justify-start cursor-pointer text-background  bg-accent-foreground py-2 px-4 rounded-md text-sm"
              }
              htmlFor="imgAvatarUploader"
            >
              {t("upload-image")}
              <UploadIcon />
            </label>
          </CardDescription>
        </CardHeader>

        <CardContent className={"flex flex-col gap-2"}>
          <div className={"flex flex-row items-center justify-start gap-2"}>
            <label className={"text-sm font-bold inline-block w-14"}>
              {t("width")}
            </label>
            <input
              name="scale"
              type="range"
              onChange={handleWidth}
              min={200}
              max="600"
              step="10"
              defaultValue="200"
            />
          </div>
          <div className={"flex flex-row items-center justify-start gap-2"}>
            <label className={"text-sm font-bold inline-block w-14"}>
              {t("height")}
            </label>
            <input
              name="scale"
              type="range"
              onChange={handleHeight}
              min={200}
              max="600"
              step="10"
              defaultValue="200"
            />
          </div>
          <div className={"flex flex-row items-center justify-start gap-2"}>
            <label className={"text-sm font-bold inline-block w-14"}>
              {t("scale")}
            </label>
            <input
              name="scale"
              type="range"
              onChange={handleScale}
              min={state.allowZoomOut ? "0.1" : "1"}
              max="2"
              step="0.01"
              defaultValue="1"
            />
          </div>
          <div className={"flex flex-row items-center justify-start gap-2"}>
            <label className={"text-sm font-bold inline-block w-14"}>
              {t("show-grid")}
            </label>
            <input
              type="checkbox"
              checked={state.showGrid}
              onChange={handleShowGrid}
            />
          </div>
          <div className={"flex flex-row items-center justify-start gap-2"}>
            <label className={"text-sm font-bold inline-block w-14"}>
              {t("border-radius")}
            </label>
            <input
              name="scale"
              type="range"
              onChange={handleBorderRadius}
              min="0"
              max="50"
              step="1"
              defaultValue="0"
            />
          </div>
          <div className={"flex flex-row items-center justify-start gap-2"}>
            <label className={"text-sm font-bold inline-block w-14"}>
              {t("rotate-scale")}
            </label>
            <input
              name="rotation"
              type="range"
              onChange={rotateScale}
              min="0"
              max="180"
              step="1"
              defaultValue="0"
            />
            <button onClick={rotateLeft}>
              <RotateCcw />
            </button>
            <button onClick={rotateRight}>
              <RotateCw />
            </button>
          </div>

          {state.isTransparent && (
            <>
              <div className={"flex flex-row items-center justify-start gap-2"}>
                <label className={"text-sm font-bold inline-block w-14"}>
                  {t("background-color")}
                </label>
                <input
                  name="backgroundColor"
                  type="color"
                  defaultValue={state.backgroundColor}
                  onChange={setBackgroundColor}
                />
              </div>

              <div className={"flex flex-row items-center justify-start gap-2"}>
                <label className={"text-sm font-bold inline-block w-14"}>
                  {t("border-color")}
                </label>
                <input
                  name="borderColor"
                  type="color"
                  value={state.borderColor.slice(0, 7)}
                  onChange={handleBorderColorChange}
                />

                {t("opacity")}
                <input
                  className={"bg-accent-foreground text-background"}
                  name="borderOpacity"
                  type="range"
                  min="0"
                  max="255"
                  value={parseInt(state.borderColor.slice(7, 9), 16)}
                  onChange={(e) => {
                    const opacity = parseInt(e.target.value)
                      .toString(16)
                      .padStart(2, "0");
                    setState({
                      ...state,
                      borderColor: state.borderColor.slice(0, 7) + opacity,
                    });
                  }}
                />
              </div>
            </>
          )}
          <div className={"flex flex-row items-center justify-center gap-2"}>
            <Button onClick={localSaveAvatar}>{t("save")}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default AvatarCutter;
