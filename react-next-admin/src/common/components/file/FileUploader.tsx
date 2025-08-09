import React, {useCallback, useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Result from "@/common/lib/protocol/Result";
import CrosStorage from "@/common/lib/CrosStorage";

interface FileUploaderProps {
    url: string;
    uploadCallback: (url: string, fileName: string) => void;
    uploadIcon: React.ReactNode;
    id: string;
}

const handleUpload = async (
    url: string,
    fileList: FileList | null,
    setUploading: any,
    setProgress: any,
    callbackRef: any
) => {
    if (!fileList || fileList.length === 0) {
        return toast.error("请选择文件");
    }
    setUploading(true);
    const file = fileList[0];
    const fileName = fileList[0].name;
    console.log("文件名:", fileName); // 输出文件名
    const splitter = fileName.split("/");
    const clientName = splitter[splitter.length - 1];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("pathType", "im");
    const token = await CrosStorage.getCrosStorage()?.getToken();
    await axios
        .post(url, formData, {
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log("上传进度:", percent);
                    setProgress(percent);
                }
            },
            headers: {
                Authorization: token,
            },
        })
        .then((response) => {
            console.log(response);
            const result: Result<any> = response.data;
            if (result?.code != "0") {
                toast.error(result?.message);
                return;
            }

            toast.success("上传成功");
            callbackRef(result.data, clientName);
            setProgress(0);
        })
        .catch((error) => {
            console.log(error);
            toast.error("上传失败: " + error.message);
        })
        .finally(() => {
            setUploading(false);
            setProgress(0);
        });
};

export default function FileUploader(fileUploaderProps: FileUploaderProps) {
    const [uploading, setUploading] = useState<boolean>();
    const [progress, setProgress] = useState<number>(0);
    const callbackRef = useCallback(fileUploaderProps.uploadCallback, [
        fileUploaderProps.uploadIcon,
    ]);

    return (
        <>
            <label
                htmlFor={fileUploaderProps.id}
                className={"flex items-center justify-center cursor-pointer"}
            >
                {fileUploaderProps.uploadIcon}
            </label>
            <input
                id={fileUploaderProps.id}
                style={{
                    border: "1px solid",
                    width: "100%",
                    height: "100%",
                    display: "none",
                }}
                type="file"
                onChange={(event) => {
                    const files = event.target.files;
                    handleUpload(
                        fileUploaderProps.url,
                        files,
                        setUploading,
                        setProgress,
                        callbackRef
                    );
                }}
            />
        </>
    );
}
