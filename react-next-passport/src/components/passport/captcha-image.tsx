"use client";

import { useState, type RefObject } from "react";
import { RefreshCw } from "lucide-react";
import styles from "./passport.module.css";

type CaptchaImageProps = {
  imageRef: RefObject<HTMLImageElement>;
  alt: string;
  refreshLabel: string;
  disabled?: boolean;
};

export default function CaptchaImage({
  imageRef,
  alt,
  refreshLabel,
  disabled = false,
}: CaptchaImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      className={styles.captchaButton}
      data-loaded={loaded}
      disabled={disabled}
      aria-label={refreshLabel}
      title={refreshLabel}
      onClick={(event) => {
        setLoaded(false);
        // Keep the existing hook's image-click refresh and avoid bubbling twice.
        if (event.target !== imageRef.current) {
          imageRef.current?.click();
        }
      }}
    >
      {/* Keep the image mounted: useCaptcha owns its session-backed URL. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        alt={alt}
        className={styles.captchaImage}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />
      {!loaded && (
        <span className={styles.captchaPlaceholder} aria-hidden="true">
          <RefreshCw size={14} />
          <span>{refreshLabel}</span>
        </span>
      )}
    </button>
  );
}
