"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * 文件上传：拖拽区 + 文件列表。
 * 悬停/拖入时描边变蓝。
 */
export function FileUpload({
  accept,
  multiple = true,
  onChange,
  className,
}: {
  accept?: string;
  multiple?: boolean;
  onChange?: (files: File[]) => void;
  className?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = multiple ? [...files, ...Array.from(list)] : Array.from(list).slice(0, 1);
    setFiles(next);
    onChange?.(next);
  };

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2lg border-2 border-dashed p-6",
          "transition-[border-color,background-color] duration-150 ease-out",
          dragging
            ? "border-accent-500 bg-badge-new-background"
            : "border-border-button-default bg-background-secondary-default hover:border-border-button-hover"
        )}
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-background-primary-default text-foreground-icon-secondary shadow-xs">
          <Icon name="upload-cloud-2-line" className="size-4" />
        </span>
        <span className="text-body-2-medium text-text-primary">点击上传或拖拽文件到此</span>
        <span className="text-caption-2-regular text-text-tertiary">
          {accept ? `支持 ${accept}` : "支持任意格式"}，单个文件不超过 20MB
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="flex flex-col gap-1">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center gap-2 rounded-lg border border-border-primary px-2 py-1.5"
            >
              <Icon name="file-line" className="size-4 shrink-0 text-foreground-icon-secondary" />
              <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">
                {f.name}
              </span>
              <span className="shrink-0 text-caption-2-regular text-text-tertiary">
                {(f.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                aria-label={`移除 ${f.name}`}
                onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded text-text-tertiary hover:bg-background-secondary-hover hover:text-text-primary"
              >
                <Icon name="close-line" className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
