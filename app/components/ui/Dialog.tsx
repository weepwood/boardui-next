"use client";

import {
  Dialog as RACDialog,
  Modal,
  ModalOverlay,
  Heading,
  type DialogProps,
  type ModalOverlayProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export { ModalOverlay, Modal };

/**
 * 弹窗：复刻原站
 * - 宽 480px（默认）、圆角 24px、白底、浅灰描边、shadow-xs
 * - 进入 / 退出动效：缩放 + 淡入
 */
export function Dialog({
  className,
  children,
  ...props
}: Omit<DialogProps, "className" | "children"> & {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <RACDialog
      {...props}
      className={cn(
        "flex min-h-0 flex-col gap-2 overflow-clip py-4 outline-none",
        "rounded-3xl border border-separator-border bg-background-full shadow-xs",
        "w-[480px] max-w-[calc(100vw-2rem)]",
        className
      )}
    >
      {children}
    </RACDialog>
  );
}

/** 弹窗头部：标题 + 描述 + 关闭按钮 */
export function DialogHeader({
  title,
  description,
  onClose,
}: {
  title: string;
  description?: string;
  onClose?: () => void;
}) {
  return (
    <div className="flex shrink-0 items-start gap-3 px-4">
      <div className="flex min-w-0 flex-1 flex-col">
        <Heading slot="title" className="py-1 text-body-medium text-text-primary">
          {title}
        </Heading>
        {description && (
          <p className="text-body-regular text-text-secondary">{description}</p>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          className={cn(
            "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg",
            "text-foreground-icon-secondary transition-colors duration-150 ease-out",
            "hover:bg-background-secondary-hover hover:text-foreground-icon-primary"
          )}
        >
          <Icon name="close-line" className="size-4" />
        </button>
      )}
    </div>
  );
}

/** 弹窗内容区 */
export function DialogBody({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-0 flex-1 flex-col gap-3 px-4">{children}</div>;
}

/** 弹窗底部操作区 */
export function DialogFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex shrink-0 items-center justify-end gap-2 px-4 pt-1">{children}</div>
  );
}

/**
 * 完整弹窗：包含遮罩 + 居中容器
 * 用法：<ModalDialog isOpen onOpenChange>{...}</ModalDialog>
 */
export function ModalDialog({
  isOpen,
  onOpenChange,
  isDismissable = true,
  title,
  description,
  children,
  className,
}: {
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
  isDismissable?: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
} & Partial<ModalOverlayProps>) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/40 backdrop-blur-[2px]",
        // 遮罩淡入淡出
        "transition-opacity duration-200 ease-out",
        "data-[entering]:animate-[fade-in_200ms_ease-out]",
        "data-[exiting]:animate-[fade-out_150ms_ease-in]"
      )}
    >
      <Modal
        className={cn(
          "outline-none",
          // 弹窗缩放进入
          "data-[entering]:animate-[modal-in_220ms_cubic-bezier(0.22,1,0.36,1)]",
          "data-[exiting]:animate-[modal-out_160ms_ease-in]"
        )}
      >
        <Dialog className={className}>
          <DialogHeader title={title} description={description} onClose={() => onOpenChange(false)} />
          {children}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
