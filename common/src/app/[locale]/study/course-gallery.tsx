"use client";

import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {Expand} from "lucide-react";
import {useTranslations} from "next-intl";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi} from "@/components/ui/carousel";
import styles from "./study.module.css";

type CourseGalleryProps = {
    images: {src: string; width: number; height: number}[];
    alt: string;
};

/** Course presentation built on the carousel migrated from the IM project. */
export default function CourseGallery({images, alt}: CourseGalleryProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [index, setIndex] = useState(0);
    const [reducedMotion, setReducedMotion] = useState(false);
    const imageLinks = useRef<(HTMLAnchorElement | null)[]>([]);
    const t = useTranslations("study.gallery");

    useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReducedMotion(media.matches);
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        if (!api) return;
        const update = () => {
            const nextIndex = api.selectedScrollSnap();
            const focusedIndex = imageLinks.current.findIndex((link) => link === document.activeElement);
            setIndex(nextIndex);
            if (focusedIndex >= 0 && focusedIndex !== nextIndex) {
                imageLinks.current[nextIndex]?.focus({preventScroll: true});
            }
        };
        update();
        api.on("select", update);
        api.on("reInit", update);
        return () => {
            api.off("select", update);
            api.off("reInit", update);
        };
    }, [api]);

    return (
        <Carousel setApi={setApi} opts={{loop: images.length > 1, duration: reducedMotion ? 0 : 25}}
                  className={styles.gallery} aria-label={alt}>
            <CarouselContent>
                {images.map((image, imageIndex) => (
                    <CarouselItem key={image.src} aria-hidden={imageIndex !== index}>
                        <a href={image.src} target="_blank" rel="noopener noreferrer" className={styles.poster}
                           ref={(element) => { imageLinks.current[imageIndex] = element; }}
                           tabIndex={imageIndex === index ? 0 : -1} aria-label={`${alt} — ${t("expand")}`}>
                            <Image src={image.src} alt={alt} width={image.width} height={image.height}
                                   sizes="(max-width: 480px) 85vw, (max-width: 760px) 45vw, 340px" className={styles.posterImage}/>
                            <span className={styles.expandIcon}><Expand size={15} aria-hidden="true"/></span>
                        </a>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <div className={styles.galleryControls} data-single={images.length === 1 || undefined}>
                <CarouselPrevious variant="ghost" aria-label={t("previous")}/>
                <span aria-live="polite" aria-atomic="true">{t("page", {current: index + 1, total: images.length})}</span>
                <CarouselNext variant="ghost" aria-label={t("next")}/>
            </div>
        </Carousel>
    );
}
