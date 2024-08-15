"use client";
import React, { useRef } from "react";
import { Upload } from "@mui/icons-material";

function Input() {
  const coverLabelRef = useRef<HTMLLabelElement>(null);
  const getFilesFromEvent = (
    event: React.DragEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>
  ): Promise<File[]> => {
    return new Promise<File[]>((resolve) => {
      let items = null;
      if ("dataTransfer" in event) {
        const dt = event.dataTransfer;
        console.log("drage");
        // NOTE: Only the 'drop' event has access to DataTransfer.files, otherwise it will always be empty
        if ("files" in dt && dt.files.length) {
          items = dt.files;
        } else if (dt.items && dt.items.length) {
          items = dt.items;
        }
      } else if (event.target && event.target.files) {
        items = event.target.files;
      }
      if (coverLabelRef.current) {
        coverLabelRef.current.style.backgroundImage =
          "url('/brand/sparrow1.jpg')";
      }
      console.log(items);
      return Array.prototype.slice.call(items);
    });
  };

  return (
    <>
      <label
        htmlFor="file-input"
        ref={coverLabelRef}
        className={
          "flex items-center justify-center bg-[url('/next.svg')]  bg-no-repeat bg-center   aspect-video  w-240 border border-stone-700  rounded-xl cursor-pointer"
        }
      >
        <div
          className={
            "flex items-center justify-center w-16 h-16 rounded-xl  z-20 text-white bg-stone-700 cursor-pointer border border-stone-700  bg-opacity-90"
          }
        >
          <Upload className="h-4 w-4 z-10 text-muted-foreground" />
        </div>
      </label>
      <input
        id={"file-input"}
        style={{ border: "1px solid", width: "100%", height: "100%" }}
        type="file"
        onChange={(e) => {
          getFilesFromEvent(e);
        }}
      />
    </>
  );
}

export default function Page() {
  return <Input />;
}
