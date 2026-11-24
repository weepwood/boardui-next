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
  className,maxBytes=20*1024*1024,
}: {
  accept?: string;
  multiple?: boolean;
  onChange?: (files: File[]) => void;
  className?: string;
  maxBytes?:number;
}) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error,setError]=useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const types=accept?.split(",").map(t=>t.trim().toLowerCase()).filter(Boolean)??[];
    const accepted:File[]=[];const rejected:string[]=[];
    for(const f of Array.from(list)){
      const name=f.name.toLowerCase(),mime=f.type.toLowerCase();
      const valid=!types.length||types.some(t=>t.startsWith(".")?name.endsWith(t):t.endsWith("/*")?mime.startsWith(t.slice(0,-1)):mime===t);
      if(!valid||f.size>maxBytes){rejected.push(f.name);continue;}accepted.push(f);
    }
    setError(rejected.length?"不支持的格式或超出大小限制："+rejected.join("、"):"");
    if(!accepted.length)return;
    const candidates=multiple?[...files,...accepted]:accepted.slice(0,1);
    const next=candidates.filter((f,i)=>candidates.findIndex(x=>x.name===f.name&&x.size===f.size&&x.lastModified===f.lastModified)===i);
    setFiles(next);onChange?.(next);
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
        role="button" tabIndex={0} aria-label="选择文件"
        onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();inputRef.current?.click();}}}
        onClick={e=>{if(e.target!==inputRef.current)inputRef.current?.click()}}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
          "transition-[border-color,background-color] duration-150 ease-out",
          dragging
            ? "border-accent-500 bg-badge-new-background"
            : "border-border-button-default bg-background-primary-default hover:border-border-button-active"
        )}
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-file-upload-icon-background text-file-upload-icon-foreground">
          <Icon name="upload-cloud-2-line" className="size-4" />
        </span>
        <span className="text-body-2-medium text-text-primary">点击选择或拖拽文件到此</span>
        <span className="text-caption-2-regular text-text-tertiary">
          {accept ? `支持 ${accept}` : "支持任意格式"}，单个文件不超过 {Math.round(maxBytes/1024/1024)}MB
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {addFiles(e.target.files);e.target.value=""}}
        />
      </div>

      {error&&<p role="alert" className="text-body-2-regular text-text-error-primary">{error}</p>}
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
                onClick={() => {const next=files.filter((_,j)=>j!==i);setFiles(next);onChange?.(next)}}
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
