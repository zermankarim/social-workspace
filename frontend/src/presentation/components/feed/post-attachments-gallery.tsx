"use client";

import { useState } from "react";
import {
  ImageLightbox,
  type LightboxImage,
} from "@/presentation/components/ui/image-lightbox";

export type GalleryAttachment = {
  id: string;
  url: string;
  fileName: string;
};

type PostAttachmentsGalleryProps = {
  attachments: GalleryAttachment[];
  className?: string;
};

function Tile({
  attachment,
  className = "",
  onOpen,
  overlayLabel,
}: {
  attachment: GalleryAttachment;
  className?: string;
  onOpen: () => void;
  overlayLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`relative block h-full w-full overflow-hidden bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
      aria-label={`Preview ${attachment.fileName}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={attachment.url}
        alt={attachment.fileName}
        className="h-full w-full object-cover transition-transform duration-200 hover:scale-[1.02]"
      />
      {overlayLabel ? (
        <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-2xl font-semibold text-white">
          {overlayLabel}
        </span>
      ) : null}
    </button>
  );
}

export function PostAttachmentsGallery({
  attachments,
  className = "",
}: PostAttachmentsGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (attachments.length === 0) return null;

  const images: LightboxImage[] = attachments.map((attachment) => ({
    src: attachment.url,
    alt: attachment.fileName,
  }));

  const openAt = (index: number) => setLightboxIndex(index);
  const count = attachments.length;

  let mosaic: React.ReactNode;

  if (count === 1) {
    mosaic = (
      <div className="overflow-hidden rounded-lg bg-surface-muted">
        <button
          type="button"
          onClick={() => openAt(0)}
          className="flex w-full items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={`Preview ${attachments[0]!.fileName}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={attachments[0]!.url}
            alt={attachments[0]!.fileName}
            className="max-h-[520px] w-full object-contain"
          />
        </button>
      </div>
    );
  } else if (count === 2) {
    mosaic = (
      <div className="grid aspect-[16/9] grid-cols-2 gap-0.5 overflow-hidden rounded-lg">
        {attachments.map((attachment, index) => (
          <Tile
            key={attachment.id}
            attachment={attachment}
            onOpen={() => openAt(index)}
          />
        ))}
      </div>
    );
  } else if (count === 3) {
    mosaic = (
      <div className="grid aspect-[16/10] grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-lg">
        <Tile
          attachment={attachments[0]!}
          onOpen={() => openAt(0)}
          className="row-span-2"
        />
        <Tile attachment={attachments[1]!} onOpen={() => openAt(1)} />
        <Tile attachment={attachments[2]!} onOpen={() => openAt(2)} />
      </div>
    );
  } else {
    const visible = attachments.slice(0, 4);
    const extra = count - 4;
    mosaic = (
      <div className="grid aspect-square grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-lg sm:aspect-[16/10]">
        {visible.map((attachment, index) => (
          <Tile
            key={attachment.id}
            attachment={attachment}
            onOpen={() => openAt(index)}
            overlayLabel={index === 3 && extra > 0 ? `+${extra}` : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className={className}>{mosaic}</div>
      {lightboxIndex !== null ? (
        <ImageLightbox
          key={lightboxIndex}
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </>
  );
}
