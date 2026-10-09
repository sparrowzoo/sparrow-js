"use client";

import * as React from "react";
import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import {UploadCloud, X} from "lucide-react";
import {Label} from "@/components/ui/label";
import ErrorMessage from "@/common/components/i18n/ErrorMessage";
import FileUploader from "@/common/components/file/FileUploader";
import {UPLOAD_URL} from "@/common/lib/Env";

export interface FormHookImageProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    pageTranslate?: (key: string) => string;
    fieldPropertyName: string;
    errorMessage?: string;
    isSubmitted?: boolean;
    readonly?: boolean;
    description?: string;
    setValue: (propertyName: string, value: unknown) => void;
    defaultValue?: string;
    pathType?: string;
}

const ValidatableImage = ({
    pageTranslate,
    fieldPropertyName,
    errorMessage,
    isSubmitted,
    readonly,
    description,
    setValue,
    defaultValue,
    pathType = "default",
}: FormHookImageProps) => {
    const t = useTranslations("FileUploader");
    const [imageUrl, setImageUrl] = useState<string>(String(defaultValue ?? ""));
    const uploadId = `validatable-image-${fieldPropertyName}`;

    useEffect(() => {
        setValue(fieldPropertyName, String(defaultValue ?? ""));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onUploaded = (url: string) => {
        setImageUrl(url);
        setValue(fieldPropertyName, url);
    };

    const onRemove = () => {
        setImageUrl("");
        setValue(fieldPropertyName, "");
    };

    const placeholder = (
        <div className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded border border-dashed border-border text-muted-foreground cursor-pointer transition-colors hover:border-violet-500/50 hover:bg-violet-500/5">
            <UploadCloud className="h-6 w-6"/>
            <span className="text-xs">{t("upload-image")}</span>
        </div>
    );

    return (
        <div className="flex flex-row justify-start items-center mb-4 gap-2">
            <Label className={"justify-end w-[8rem]"}>
                {pageTranslate?.(fieldPropertyName) || fieldPropertyName}
            </Label>
            <div className={"flex-1"}>
                <div className="flex flex-row items-start gap-3">
                    <div className="relative">
                        {readonly ? (
                            imageUrl
                                ? <img src={imageUrl} alt="" className="h-24 w-24 rounded border border-border object-cover"/>
                                : <div className="flex h-24 w-24 items-center justify-center rounded border border-dashed border-border text-muted-foreground">
                                    <UploadCloud className="h-6 w-6"/>
                                </div>
                        ) : (
                            <FileUploader
                                url={UPLOAD_URL!}
                                pathType={pathType}
                                uploadCallback={onUploaded}
                                accept="image/*"
                                uploadIcon={
                                    imageUrl
                                        ? <img src={imageUrl} alt="" className="h-24 w-24 rounded border border-border object-cover cursor-pointer"/>
                                        : placeholder
                                }
                                id={uploadId}
                            />
                        )}
                        {imageUrl && !readonly && (
                            <button
                                type="button"
                                onClick={onRemove}
                                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                aria-label={t("remove")}
                                title={t("remove")}
                            >
                                <X className="h-3 w-3"/>
                            </button>
                        )}
                    </div>
                </div>
                {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
            </div>
            <div className={"w-[10rem]"}>
                <ErrorMessage messageClass={"text-sm text-red-500"} submitted={isSubmitted as boolean} message={errorMessage}/>
            </div>
        </div>
    );
};

ValidatableImage.displayName = "ValidatableImage";
export {ValidatableImage};
