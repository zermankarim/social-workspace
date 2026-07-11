"use client";

import { useEffect, useId, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxImage = {
  src: string;
  alt: string;
};

type ImageLightboxProps = {
  images: LightboxImage[];
  initialIndex?: number;
  onClose: () => void;
};

export function ImageLightbox({
  images,
  initialIndex = 0,
  onClose,
}: ImageLightboxProps) {
  const titleId = useId();
  const [index, setIndex] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(images.length - 1, 0)),
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (images.length < 2) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex((current) =>
          current === 0 ? images.length - 1 : current - 1,
        );
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setIndex((current) =>
          current === images.length - 1 ? 0 : current + 1,
        );
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [images.length, onClose]);

  if (images.length === 0) return null;

  const current = images[Math.min(index, images.length - 1)]!;
  const canNavigate = images.length > 1;

  const goPrev = () =>
    setIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  const goNext = () =>
    setIndex((current) => (current === images.length - 1 ? 0 : current + 1));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 px-3 py-8">
      <button
        type="button"
        aria-label="Close preview"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-full w-full max-w-5xl flex-col"
      >
        <div className="mb-3 flex items-center justify-between gap-3 text-white">
          <p
            id={titleId}
            className="truncate text-sm font-medium text-white/70"
          >
            {canNavigate ? `${index + 1} / ${images.length}` : "\u00a0"}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/90 transition-colors hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          {canNavigate ? (
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-0 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 sm:-left-2"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </button>
          ) : null}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.src}
            alt={current.alt}
            className="max-h-[min(80vh,900px)] w-auto max-w-full rounded-md object-contain"
          />

          {canNavigate ? (
            <button
              type="button"
              onClick={goNext}
              className="absolute right-0 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 sm:-right-2"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
