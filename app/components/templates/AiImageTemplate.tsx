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
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(true);

  const generate = () => {
    setLoading(true);
    setGenerated(false);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 1400);
  };

  return (
    <div className="flex min-h-[640px] w-full flex-col overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default shadow-card lg:flex-row">
      {/* 控制面板 */}
      <aside className="flex w-full shrink-0 flex-col gap-3 border-b border-border-primary p-4 lg:w-[280px] lg:border-b-0 lg:border-e">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#a855f7,#6366f1)] text-white">
            <Icon name="magic-line" className="size-4" />
          </span>
          <span className="text-body-medium text-text-primary">图像生成</span>
          <Badge variant="pro" className="ms-auto">Pro</Badge>
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
          value={style}
          onChange={(v) => setStyle(String(v))}
          options={STYLES}
        />
        <Select
          label="比例"
          value={ratio}
          onChange={(v) => setRatio(String(v))}
          options={RATIOS}
        />

        <Button
          onClick={generate}
          isDisabled={loading}
          leading={
            loading ? (
              <Icon name="loader-4-line" className="size-4 animate-spin" />
            ) : (
              <Icon name="sparkling-line" className="size-4" />
            )
          }
        >
          {loading ? "生成中…" : "生成图像"}
        </Button>

        <div className="mt-auto rounded-lg bg-background-secondary-default p-2">
          <div className="flex items-center justify-between text-[10px] text-text-tertiary">
            <span>本月额度</span>
            <span className="tabular-nums">62 / 100</span>
          </div>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-background-tertiary-default">
            <div className="h-full w-[62%] rounded-full bg-accent-500" />
          </div>
        </div>
      </aside>

      {/* 结果区 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-2 border-b border-border-primary px-4 py-2.5">
          <span className="text-body-2-medium text-text-primary">生成结果</span>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" leading={<Icon name="download-line" className="size-3.5" />}>
              全部下载
            </Button>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-2 gap-2 p-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video w-full" rounded="lg" />
              ))
            : generated &&
              RESULTS.map((r) => (
                <div
                  key={r.id}
                  className={cn(
                    "group relative aspect-video overflow-hidden rounded-xl border border-border-primary",
                    "transition-[border-color,box-shadow] duration-150 ease-out",
                    "hover:border-border-button-hover hover:shadow-md"
                  )}
                  style={{
                    background: `linear-gradient(135deg, hsl(${r.hue} 85% 92%), hsl(${r.hue} 70% 76%) 60%, hsl(${r.hue + 30} 65% 68%))`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon
                      name="landscape-line"
                      className="size-8 text-white/40"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/40 to-transparent px-2 pb-1.5 pt-4 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    <span className="text-[10px] font-medium text-white">{r.label}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="放大"
                        className="flex size-5 cursor-pointer items-center justify-center rounded bg-white/25 text-white backdrop-blur-sm hover:bg-white/35"
                      >
                        <Icon name="zoom-in-line" className="size-3" />
                      </button>
                      <button
                        type="button"
                        aria-label="下载"
                        className="flex size-5 cursor-pointer items-center justify-center rounded bg-white/25 text-white backdrop-blur-sm hover:bg-white/35"
                      >
                        <Icon name="download-line" className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
