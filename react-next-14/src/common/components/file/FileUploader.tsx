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
    accept?: string;
}

function acceptsFile(file: File, accept?: string): boolean {
    if (!accept) return true;
    return accept.split(",").some((entry) => {
        const pattern = entry.trim().toLowerCase();
        if (pattern === "*" || pattern === "*/*") return true;
        if (pattern.endsWith("/*")) return file.type.toLowerCase().startsWith(pattern.slice(0, -1));
        if (pattern.startsWith(".")) return file.name.toLowerCase().endsWith(pattern);
        return file.type.toLowerCase() === pattern;
    });
}

export default function FileUploader({url, uploadCallback, uploadIcon, id, pathType = "im", accept}: FileUploaderProps) {
    const t = useTranslations("FileUploader");
    const [uploading, setUploading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    const handleUpload = useCallback(
        async (fileList: FileList | null) => {
            if (!fileList || fileList.length === 0) {
                toast.error(t("select-file"));
                return;
            }
            const file = fileList[0];
            if (!acceptsFile(file, accept)) {
                toast.error(t("invalid-file-type"));
                return;
            }
            setUploading(true);
            const clientName = file.name.split("/").pop() ?? file.name;
            const formData = new FormData();
            formData.append("file", file);
            formData.append("pathType", pathType);
            try {
                const token = await CrosStorage.getCrosStorage().getToken();
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
                    const message = result?.message??"";
                    toast.error(t("upload-failed", {message}));
                    return;
                }
                toast.success(t("upload-success"));
                uploadCallback(result.data as string, clientName);
            } catch (error) {
                const message = error instanceof Error ? error.message : "";
                toast.error(t("upload-failed", {message}));
            } finally {
                setUploading(false);
                setProgress(0);
            }
        },
        [url, uploadCallback, pathType, accept, t]
    );

    return (
        <>
            <label
                htmlFor={id}
                className={"relative flex items-center justify-center cursor-pointer"}
            >
                {uploadIcon}
                {uploading && (
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded bg-background/70">
                        <span className="text-xs font-medium text-foreground">{progress}%</span>
                        <span className="h-1 w-16 overflow-hidden rounded-full bg-muted">
                            <span
                                className="block h-full rounded-full bg-violet-500 transition-all duration-200"
                                style={{width: `${progress}%`}}
                            />
                        </span>
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
                accept={accept}
                disabled={uploading}
                onChange={(event) => handleUpload(event.target.files)}
            />
        </>
    );
}
