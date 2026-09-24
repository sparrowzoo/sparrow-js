"use client";

import {useState} from "react";
import styles from "../product.module.css";

type CodeBlockProps = {
  code: string;
  language?: string;
  label?: string;
  locale: string;
};

type CopyStatus = "idle" | "copying" | "copied" | "error";

export default function CodeBlock({code, language, label, locale}: CodeBlockProps) {
  const [copyState, setCopyState] = useState<{code: string; status: CopyStatus}>({
    code,
    status: "idle",
  });
  const text = locale.startsWith("zh")
    ? {
        copy: "复制",
        copied: "已复制",
        error: "复制失败",
        errorHelp: "复制失败，请选中代码后手动复制。",
        snippet: "代码示例",
      }
    : {
        copy: "Copy",
        copied: "Copied",
        error: "Copy failed",
        errorHelp: "Copy failed. Select the code and copy it manually.",
        snippet: "Code example",
      };
  const caption = label || language || text.snippet;
  const status = copyState.code === code ? copyState.status : "idle";
  const buttonLabel = status === "copied" ? text.copied : status === "error" ? text.error : text.copy;

  async function copyCode() {
    setCopyState({code, status: "copying"});

    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        // The initial HTTP deployment does not expose the async Clipboard API.
        const input = document.createElement("textarea");
        const previousFocus = document.activeElement as HTMLElement | null;
        input.value = code;
        input.style.cssText = "position:fixed;left:-9999px;top:0";
        document.body.appendChild(input);
        try {
          input.select();
          if (!document.execCommand("copy")) throw new Error("Copy failed");
        } finally {
          input.remove();
          previousFocus?.focus();
        }
      }
      setCopyState({code, status: "copied"});
    } catch {
      setCopyState({code, status: "error"});
    }
  }

  return (
    <figure className={styles.codeBlock}>
      <figcaption className={styles.codeHeader}>
        <span>{caption}</span>
        <button
          type="button"
          className={styles.copyButton}
          onClick={copyCode}
          disabled={status === "copying"}
          aria-busy={status === "copying"}
          aria-label={`${buttonLabel}: ${caption}`}
        >
          {buttonLabel}
        </button>
      </figcaption>
      <pre tabIndex={0} aria-label={caption}>
        <code className={language ? `language-${language}` : undefined}>{code}</code>
      </pre>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {status === "copied" ? text.copied : status === "error" ? text.errorHelp : ""}
      </span>
    </figure>
  );
}
