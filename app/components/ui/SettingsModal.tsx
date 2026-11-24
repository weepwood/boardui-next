"use client";

import { useState } from "react";
import {ModalOverlay,Modal,Dialog} from "react-aria-components";
import {MODAL_BACKDROP,MODAL_MOTION,MODAL_SURFACE} from "@/packages/react/overlay-styles";
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

  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={open=>{if(!open)onClose()}} isDismissable className={cn(MODAL_BACKDROP,"flex items-center justify-center p-4")}>
      <Modal className={cn("w-[min(640px,calc(100vw-2rem))] outline-none",MODAL_MOTION)}>
      <Dialog aria-label="设置" className={cn(MODAL_SURFACE,"flex h-[min(460px,calc(100dvh-2rem))] min-w-0 flex-col overflow-hidden outline-none sm:flex-row")}>
        <aside className="flex shrink-0 flex-wrap gap-1 border-b border-separator-border bg-background-secondary-default p-3 sm:w-[156px] sm:flex-col sm:border-b-0 sm:border-e">
          <div className="hidden px-2 py-1.5 text-body-medium text-text-primary sm:block">设置</div>
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setTab(n.id)} aria-pressed={tab===n.id}
              className={cn(
                "flex items-center gap-2 rounded-2lg px-2.5 py-2 text-start text-body-medium",
                "transition-colors duration-150 ease-out",
                tab === n.id
                  ? "bg-background-primary-default text-text-primary shadow-xs"
                  : "text-text-secondary hover:bg-background-secondary-hover hover:text-text-primary"
              )}
            >
              <Icon name={n.icon} className="size-3.5 shrink-0" />
              {n.label}
            </button>
          ))}
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-separator-border px-4 py-2.5">
            <span className="text-body-2-medium text-text-primary">
              {NAV.find((n) => n.id === tab)?.label}
            </span>
            <CloseButton aria-label="关闭" onClick={onClose} />
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-5">
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
      </Dialog></Modal>
    </ModalOverlay>
  );
}
