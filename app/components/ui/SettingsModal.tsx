"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";
import { Switch } from "./Switch";
import { Select } from "./Select";
import { CloseButton } from "./CloseButton";

const NAV = [
  { id: "general", label: "通用", icon: "settings-3-line" },
  { id: "appearance", label: "外观", icon: "palette-line" },
  { id: "notify", label: "通知", icon: "notification-3-line" },
  { id: "advanced", label: "高级", icon: "equalizer-line" },
];

/**
 * 设置对话框：左侧分类导航 + 右侧表单。
 */
export function SettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState("general");
  const [s1, setS1] = useState(true);
  const [s2, setS2] = useState(false);
  const [lang, setLang] = useState("zh");

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 animate-[fade-in_180ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="设置"
        className={cn(
          "relative z-10 flex h-[420px] w-[min(620px,calc(100vw-2rem))] overflow-hidden rounded-3xl",
          "border border-border-button-default bg-background-full shadow-lg",
          "animate-[modal-in_220ms_cubic-bezier(0.22,1,0.36,1)]"
        )}
      >
        <aside className="flex w-[150px] shrink-0 flex-col gap-0.5 border-e border-separator-border bg-background-secondary-default p-2">
          <div className="px-2 py-1.5 text-body-2-medium text-text-primary">设置</div>
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setTab(n.id)}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-start text-body-2-medium",
                "transition-colors duration-150 ease-out",
                tab === n.id
                  ? "bg-background-primary-default text-text-primary shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <Icon name={n.icon} className="size-3.5 shrink-0" />
              {n.label}
            </button>
          ))}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-separator-border px-4 py-2.5">
            <span className="text-body-2-medium text-text-primary">
              {NAV.find((n) => n.id === tab)?.label}
            </span>
            <CloseButton onClick={onClose} />
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            {tab === "general" && (
              <>
                <Select
                  label="界面语言"
                  value={lang}
                  onChange={(v) => setLang(String(v))}
                  options={[
                    { id: "zh", label: "简体中文" },
                    { id: "en", label: "English" },
                  ]}
                />
                <Switch isSelected={s1} onChange={setS1}>
                  启动时自动恢复上次会话
                </Switch>
                <Switch isSelected={s2} onChange={setS2}>
                  使用实验性功能
                </Switch>
              </>
            )}
            {tab === "appearance" && (
              <>
                <Switch isSelected={s1} onChange={setS1}>
                  跟随系统主题
                </Switch>
                <Switch isSelected={s2} onChange={setS2}>
                  启用界面动效
                </Switch>
              </>
            )}
            {tab === "notify" && (
              <>
                <Switch isSelected={s1} onChange={setS1}>
                  任务完成时提醒
                </Switch>
                <Switch isSelected={s2} onChange={setS2}>
                  每周汇总邮件
                </Switch>
              </>
            )}
            {tab === "advanced" && (
              <div className="flex flex-col gap-2 text-caption-1-regular text-text-secondary">
                <p>高级选项会影响性能，请谨慎修改。</p>
                <Switch isSelected={s2} onChange={setS2}>
                  启用调试日志
                </Switch>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
