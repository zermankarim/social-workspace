"use client";

import { useState } from "react";
import type { MessageAttachment } from "@/core/domain/entities/message-attachment.entity";
import {
  ImageLightbox,
  type LightboxImage,
} from "@/presentation/components/ui/image-lightbox";

type MessageAttachmentsGalleryProps = {
  attachments: MessageAttachment[];
  tone?: "own" | "peer";
};

export function MessageAttachmentsGallery({
  attachments,
  tone = "peer",
}: MessageAttachmentsGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (attachments.length === 0) return null;

  const images: LightboxImage[] = attachments.map((attachment, index) => ({
    src: attachment.url,
    alt: `Attachment ${index + 1}`,
  }));

  const ring =
    tone === "own"
      ? "ring-primary-foreground/25"
      : "ring-black/5 dark:ring-white/10";

  return (
    <>
      <ul
        className={`grid gap-1 ${
          attachments.length === 1 ? "grid-cols-1" : "grid-cols-2"
        }`}
      >
        {attachments.map((attachment, index) => (
          <li key={attachment.id} className="min-w-0">
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              className={`block w-full overflow-hidden rounded-xl ring-1 ${ring} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={attachment.url}
                alt=""
                className={`w-full object-cover ${
                  attachments.length === 1
                    ? "max-h-64"
                    : "aspect-square max-h-40"
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
      {lightboxIndex !== null ? (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </>
  );
}
