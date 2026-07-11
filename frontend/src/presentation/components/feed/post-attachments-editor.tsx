"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, GripVertical, X } from "lucide-react";
import {
  ImageLightbox,
  type LightboxImage,
} from "@/presentation/components/ui/image-lightbox";

export type EditableAttachmentPreview = {
  id: string;
  previewUrl: string;
  fileName: string;
};

type PostAttachmentsEditorProps = {
  attachments: EditableAttachmentPreview[];
  disabled?: boolean;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onRemove: (id: string) => void;
};

export function PostAttachmentsEditor({
  attachments,
  disabled = false,
  onReorder,
  onRemove,
}: PostAttachmentsEditorProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (attachments.length === 0) return null;

  const canReorder = attachments.length > 1 && !disabled;
  const images: LightboxImage[] = attachments.map((attachment) => ({
    src: attachment.previewUrl,
    alt: attachment.fileName,
  }));

  return (
    <div className="space-y-2">
      {canReorder ? (
        <p className="text-xs text-muted">
          Drag images or use arrows to change order · click to preview
        </p>
      ) : (
        <p className="text-xs text-muted">Click an image to preview</p>
      )}
      <ul
        className={`grid gap-2 ${
          attachments.length === 1
            ? "grid-cols-1"
            : attachments.length === 3
              ? "grid-cols-2 sm:grid-cols-3"
              : "grid-cols-2"
        }`}
      >
        {attachments.map((attachment, index) => {
          const isDragging = dragIndex === index;
          const isOver = overIndex === index && dragIndex !== index;

          return (
            <li
              key={attachment.id}
              draggable={canReorder}
              onDragStart={(event) => {
                if (!canReorder) return;
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", String(index));
                setDragIndex(index);
              }}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              onDragOver={(event) => {
                if (!canReorder || dragIndex === null) return;
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                if (overIndex !== index) setOverIndex(index);
              }}
              onDragLeave={() => {
                if (overIndex === index) setOverIndex(null);
              }}
              onDrop={(event) => {
                if (!canReorder || dragIndex === null) return;
                event.preventDefault();
                onReorder(dragIndex, index);
                setDragIndex(null);
                setOverIndex(null);
              }}
              className={`relative aspect-square overflow-hidden rounded-lg bg-surface-muted transition-shadow ${
                canReorder ? "cursor-grab active:cursor-grabbing" : ""
              } ${isDragging ? "opacity-50" : ""} ${
                isOver
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-surface"
                  : ""
              } ${
                attachments.length === 1 ? "aspect-[16/10] max-h-72 w-full" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                disabled={disabled}
                className="absolute inset-0"
                aria-label={`Preview ${attachment.fileName}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={attachment.previewUrl}
                  alt={attachment.fileName}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </button>

              {canReorder ? (
                <span
                  className="pointer-events-none absolute left-2 top-2 rounded-md bg-black/65 p-1 text-white"
                  aria-hidden
                >
                  <GripVertical className="h-3.5 w-3.5" />
                </span>
              ) : null}

              <button
                type="button"
                onClick={() => onRemove(attachment.id)}
                disabled={disabled}
                className="absolute right-2 top-2 z-10 rounded-full bg-black/65 p-1.5 text-white transition-colors hover:bg-black/80 disabled:opacity-50"
                aria-label={`Remove ${attachment.fileName}`}
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>

              {canReorder ? (
                <div className="absolute bottom-2 left-2 z-10 flex gap-1">
                  <button
                    type="button"
                    disabled={disabled || index === 0}
                    onClick={() => onReorder(index, index - 1)}
                    className="rounded-full bg-black/65 p-1.5 text-white transition-colors hover:bg-black/80 disabled:opacity-40"
                    aria-label={`Move ${attachment.fileName} earlier`}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    disabled={disabled || index === attachments.length - 1}
                    onClick={() => onReorder(index, index + 1)}
                    className="rounded-full bg-black/65 p-1.5 text-white transition-colors hover:bg-black/80 disabled:opacity-40"
                    aria-label={`Move ${attachment.fileName} later`}
                  >
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      {lightboxIndex !== null ? (
        <ImageLightbox
          key={lightboxIndex}
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </div>
  );
}
