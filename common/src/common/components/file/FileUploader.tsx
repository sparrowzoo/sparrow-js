"use client";

import React, {useCallback, useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {useTranslations} from "next-intl";
import Result from "@/common/lib/protocol/Result";
import CrosStorage from "@/common/lib/CrosStorage";

interface FileUploaderProps {
    url: string;
    uploadCallback: (url: string, fileName: string) => void;
    uploadIcon: React.ReactNode;
    id: string;
    pathType?: string;
}

export default function FileUploader({url, uploadCallback, uploadIcon, id, pathType = "im"}: FileUploaderProps) {
    const t = useTranslations("FileUploader");
    const [uploading, setUploading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    const handleUpload = useCallback(
        async (fileList: FileList | null) => {
            if (!fileList || fileList.length === 0) {
                toast.error(t("select-file"));
                return;
            }
            setUploading(true);
            const file = fileList[0];
            const clientName = file.name.split("/").pop() ?? file.name;
            const formData = new FormData();
            formData.append("file", file);
            formData.append("pathType", pathType);
            const token = await CrosStorage.getCrosStorage()?.getToken();

            try {
                const response = await axios.post(url, formData, {
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percent = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            setProgress(percent);
                        }
                    },
                    headers: {
                        Authorization: token,
                    },
                });

                const result: Result = response.data;
                if (result?.code !== "0") {
                    toast.error(result?.message);
                    return;
                }
                toast.success(t("upload-success"));
                uploadCallback(result.data, clientName);
            } catch (error) {
                const message = error instanceof Error ? error.message : "";
                toast.error(t("upload-failed", {message}));
            } finally {
                setUploading(false);
                setProgress(0);
            }
        },
        [url, uploadCallback, pathType, t]
    );

    return (
        <>
            <label
                htmlFor={id}
                className={"flex items-center justify-center cursor-pointer"}
            >
                {uploadIcon}
                {uploading && (
                    <span className="ml-2 text-xs text-muted-foreground">
                        {progress}%
                    </span>
                )}
            </label>
            <input
                id={id}
                style={{
                    border: "1px solid",
                    width: "100%",
                    height: "100%",
                    display: "none",
                }}
                type="file"
                disabled={uploading}
                onChange={(event) => handleUpload(event.target.files)}
            />
        </>
    );
}
