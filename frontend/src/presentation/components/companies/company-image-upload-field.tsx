"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { appContainer } from "@/modules/app.container";

type CompanyImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  uploadLabel: string;
  disabled?: boolean;
  /** "square" for the logo, "wide" for the cover banner. */
  shape?: "square" | "wide";
};

export function CompanyImageUploadField({
  label,
  value,
  onChange,
  uploadLabel,
  disabled = false,
  shape = "square",
}: CompanyImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const result = await appContainer.uploadService.upload(file);
      onChange(result.url);
    } finally {
      setUploading(false);
    }
  }

  const previewClass =
    shape === "wide" ? "h-20 w-full rounded-lg" : "h-16 w-16 rounded-lg";

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <div
          className={`shrink-0 overflow-hidden bg-surface-muted ${previewClass}`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
            event.target.value = "";
          }}
        />
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-muted disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : (
            <Upload className="h-3.5 w-3.5" aria-hidden />
          )}
          {uploadLabel}
        </button>
      </div>
    </div>
  );
}
