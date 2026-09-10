import { useCallback, useId, useRef, useState } from "react";
import { ImageUp, X } from "lucide-react";

export interface UploadedImage {
  file: File;
  url: string;
  width: number;
  height: number;
}

interface UploadPanelProps {
  image: UploadedImage | null;
  onSelect: (image: UploadedImage) => void;
  onClear: () => void;
  onError: (message: string) => void;
  scanning?: boolean;
}

const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/bmp", "image/gif"];

export function UploadPanel({
  image,
  onSelect,
  onClear,
  onError,
  scanning = false,
}: UploadPanelProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!ACCEPTED.includes(file.type)) {
        onError("Unsupported file type. Upload a PNG, JPG, WEBP or BMP image.");
        return;
      }
      const url = URL.createObjectURL(file);
      const probe = new Image();
      probe.onload = () => onSelect({ file, url, width: probe.width, height: probe.height });
      probe.onerror = () => {
        URL.revokeObjectURL(url);
        onError("That image could not be read. Try a different file.");
      };
      probe.src = url;
    },
    [onError, onSelect],
  );

  if (image) {
    return (
      <section aria-label="Uploaded image" className="panel animate-rise rounded-2xl p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="label-mono">Input Image</p>
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 font-mono text-[11px] tracking-wider text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            REMOVE
          </button>
        </div>

        <div
          className={`relative mt-4 grid aspect-square w-full place-items-center overflow-hidden rounded-xl border border-border bg-background/60 ${
            scanning ? "scanline" : ""
          }`}
        >
          <img
            src={image.url}
            alt={`Uploaded input: ${image.file.name}`}
            className="h-full w-full object-contain p-6 [image-rendering:pixelated]"
          />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="min-w-0">
            <dt className="label-mono">File</dt>
            <dd className="mt-1 truncate text-foreground/85">{image.file.name}</dd>
          </div>
          <div className="min-w-0">
            <dt className="label-mono">Dimensions</dt>
            <dd className="mt-1 text-foreground/85">
              {image.width} × {image.height} px
            </dd>
          </div>
        </dl>
      </section>
    );
  }

  return (
    <section className="panel rounded-2xl p-5">
      <p className="label-mono">Input Image</p>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        tabIndex={0}
        role="button"
        className={`mt-4 flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 text-center transition-colors ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-border-strong bg-background/40 hover:border-primary/50 hover:bg-surface-raised/50"
        }`}
      >
        <span className="grid h-14 w-14 place-items-center rounded-full border border-border-strong bg-surface-raised">
          <ImageUp className="h-6 w-6 text-primary" aria-hidden />
        </span>
        <span className="font-display text-lg font-medium text-foreground">Drop an image here</span>
        <span className="text-sm text-muted-foreground">or browse from your device</span>
        <span className="label-mono mt-2 max-w-xs leading-relaxed">
          Fashion-MNIST samples are 28×28 grayscale — larger images are resized by the backend
        </span>
      </label>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
      />
    </section>
  );
}
