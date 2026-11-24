"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Chip } from "@/app/components/ui/Chip";
import { Badge } from "@/app/components/ui/Badge";
import { Icon } from "@/app/components/ui/Icon";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { Select } from "@/app/components/ui/Select";
import { Textarea } from "@/app/components/ui/Textarea";
import { cn } from "@/lib/utils";

const STYLES = [
  { id: "photo", label: "写实摄影" },
  { id: "illustration", label: "插画" },
  { id: "3d", label: "3D 渲染" },
  { id: "flat", label: "扁平矢量" },
];

const RATIOS = [
  { id: "1:1", label: "1:1 方形" },
  { id: "16:9", label: "16:9 横版" },
  { id: "9:16", label: "9:16 竖版" },
];

const RESULTS = [
  { id: "g1", hue: 215, label: "方案 1" },
  { id: "g2", hue: 280, label: "方案 2" },
  { id: "g3", hue: 160, label: "方案 3" },
  { id: "g4", hue: 32, label: "方案 4" },
];

/** AI 图像生成模板：提示词输入 + 参数 + 结果网格 */
export function AiImageTemplate() {
  const [prompt, setPrompt] = useState("一座悬浮在云海之上的极简建筑，黄昏光线，电影感");
  const [style, setStyle] = useState("photo");
  const [ratio, setRatio] = useState("16:9");
  const [preview,setPreview]=useState({prompt,style,ratio});
 const [zoom,setZoom]=useState<string|null>(null);

  const generate=()=>setPreview({prompt:prompt.trim(),style,ratio});
  const save=(r:typeof RESULTS[number])=>{
    const [w,h]=preview.ratio==="16:9"?[960,540]:preview.ratio==="9:16"?[540,960]:[720,720];
    const canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;
    const ctx=canvas.getContext("2d");if(!ctx)return;
    const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"hsl("+r.hue+" 85% 92%)");g.addColorStop(1,"hsl("+(r.hue+30)+" 65% 68%)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    ctx.fillStyle="#202020";ctx.font="24px sans-serif";ctx.fillText("Local gradient sample",24,48);
    const a=document.createElement("a");a.download=r.id+".png";a.href=canvas.toDataURL("image/png");a.click();
  };

  return (
    <div className="flex min-h-[640px] w-full flex-col overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default shadow-sidebar lg:flex-row">
      {/* 控制面板 */}
      <aside className="flex w-full shrink-0 flex-col gap-3 border-b border-border-primary p-4 lg:w-[280px] lg:border-b-0 lg:border-e">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#a855f7,#6366f1)] text-white">
            <Icon name="magic-line" className="size-4" />
          </span>
          <span className="text-body-medium text-text-primary">图像生成</span>
          <Badge variant="pro" className="ms-auto">本地示例</Badge>
        </div>

        <Textarea
          label="提示词"
          value={prompt}
          onChange={setPrompt}
          rows={4}
          description="描述主体、场景、光线与风格"
        />

        <div className="flex flex-wrap gap-1.5">
          <Chip label="电影感" defaultSelected />
          <Chip label="黄昏" defaultSelected />
          <Chip label="极简" />
          <Chip label="高细节" />
        </div>

        <Select
          label="风格"
          selectedKey={style}
          onSelectionChange={(v) => setStyle(String(v))}
          options={STYLES}
        />
        <Select
          label="比例"
          selectedKey={ratio}
          onSelectionChange={(v) => setRatio(String(v))}
          options={RATIOS}
        />

        <Button onPress={generate} isDisabled={!prompt.trim()}>更新本地预览</Button>
        <p className="text-body-2-regular text-text-secondary">仅展示参数与渐变占位图，未接入图像生成服务。</p>
      </aside>

      {/* 结果区 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-2 border-b border-border-primary px-4 py-2.5">
          <span className="text-body-2-medium text-text-primary">渐变样例 · {preview.ratio}</span>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onPress={()=>save(RESULTS[0])} leading={<Icon name="download-line" className="size-3.5" />}>
              下载样例
            </Button>
          </div>
        </header>

        <p className="px-4 pt-3 text-body-2-regular text-text-secondary break-words">{preview.prompt} · {STYLES.find(s=>s.id===preview.style)?.label}</p>
        <div className="grid flex-1 grid-cols-1 items-start gap-3 p-3 sm:grid-cols-2">
          {RESULTS.map((r) => (
                <div
                  key={r.id}
                  className={cn(
                    "group relative min-w-0 overflow-hidden rounded-xl border border-border-primary",
                    "transition-[border-color,box-shadow] duration-150 ease-out",
                    "hover:border-border-button-hover hover:shadow-md"
                  )}
                  style={{
                    aspectRatio:preview.ratio.replace(":","/"), background: `linear-gradient(135deg, hsl(${r.hue} 85% 92%), hsl(${r.hue} 70% 76%) 60%, hsl(${r.hue + 30} 65% 68%))`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon
                      name="landscape-line"
                      className="size-8 text-white/40"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/40 to-transparent px-2 pb-1.5 pt-4 opacity-100 sm:opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                    <span className="text-[10px] font-medium text-white">{r.label}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={"放大 "+r.label} onClick={()=>setZoom(r.id)}
                        className="flex size-5 cursor-pointer items-center justify-center rounded bg-white/25 text-white backdrop-blur-sm hover:bg-white/35"
                      >
                        <Icon name="zoom-in-line" className="size-3" />
                      </button>
                      <button
                        type="button"
                        aria-label={"下载 "+r.label} onClick={()=>save(r)}
                        className="flex size-5 cursor-pointer items-center justify-center rounded bg-white/25 text-white backdrop-blur-sm hover:bg-white/35"
                      >
                        <Icon name="download-line" className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
        {zoom&&<div className="p-3"><Button variant="secondary" onPress={()=>setZoom(null)}>关闭放大预览</Button><div className="mt-2 rounded-2xl" aria-label="放大样例" style={{aspectRatio:preview.ratio.replace(":","/"),background:"linear-gradient(135deg,hsl("+RESULTS.find(r=>r.id===zoom)!.hue+" 85% 92%),hsl("+RESULTS.find(r=>r.id===zoom)!.hue+" 65% 68%))"}}/></div>}
      </div>
    </div>
  );
}
