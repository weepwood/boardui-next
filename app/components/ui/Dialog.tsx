"use client";

import {
  Dialog as RACDialog,
  Modal,
  ModalOverlay,
  Heading,
  Text,
  type DialogProps,
  type ModalOverlayProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";
import { CloseButton } from "@/packages/react/close-button";
import { MODAL_BACKDROP, MODAL_SURFACE, MODAL_MOTION } from "@/packages/react/overlay-styles";

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
        "flex min-h-0 min-w-0 flex-col gap-4 overflow-y-auto overscroll-contain py-4 outline-none sm:py-5",
        MODAL_SURFACE,
        "w-[480px] max-w-[calc(100vw-2rem)] max-h-[calc(var(--visual-viewport-height,100dvh)-2rem)]",
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
    <div className="flex shrink-0 items-start gap-3 px-4 sm:px-5">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Heading slot="title" className="break-words text-headline-medium text-text-primary">
          {title}
        </Heading>
        {description && (
          <Text slot="description" className="break-words text-body-regular text-text-secondary">{description}</Text>
        )}
      </div>
      {onClose && (
        <CloseButton size="md" aria-label="关闭" onClick={onClose}/>
      )}
    </div>
  );
}

/** 弹窗内容区 */
export function DialogBody({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 sm:px-5 [scrollbar-gutter:stable]">{children}</div>;
}

/** 弹窗底部操作区 */
export function DialogFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 px-4 pt-1 sm:px-5">{children}</div>
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
  ...overlayProps
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
      {...overlayProps}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      className={cn(
        MODAL_BACKDROP, "flex items-center justify-center overflow-y-auto overscroll-contain p-4"
      )}
    >
      <Modal
        className={cn(
          "min-w-0 max-w-full outline-none", MODAL_MOTION
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
