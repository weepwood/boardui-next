"use client";

import { cn } from "@/lib/utils";

export type SocialProvider = "google" | "github" | "apple" | "x" | "wechat";

const PROVIDERS: Record<
  SocialProvider,
  { label: string; bg: string; fg: string; path: string }
> = {
  google: {
    label: "Google",
    bg: "bg-white dark:bg-background-primary-default",
    fg: "text-text-primary",
    // Google 四色 G
    path: "M21.35 11.1H12v3.2h5.35c-.25 1.35-1.55 3.95-5.35 3.95-3.2 0-5.8-2.65-5.8-5.9s2.6-5.9 5.8-5.9c1.85 0 3.1.75 3.8 1.45l2.6-2.5C16.8 3.9 14.6 3 12 3 6.95 3 2.85 7.05 2.85 12S6.95 21 12 21c5.35 0 8.9-3.75 8.9-9.05 0-.6-.05-1.05-.15-1.5z",
  },
  github: {
    label: "GitHub",
    bg: "bg-[#24292f] dark:bg-[#f0f6fc]",
    fg: "text-white dark:text-[#24292f]",
    path: "M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33s1.7.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z",
  },
  apple: {
    label: "Apple",
    bg: "bg-black dark:bg-white",
    fg: "text-white dark:text-black",
    path: "M16.37 12.6c.02 2.3 2.02 3.07 2.04 3.08-.02.05-.32 1.1-1.05 2.17-.63.93-1.29 1.85-2.33 1.87-1.02.02-1.35-.61-2.52-.61-1.17 0-1.53.59-2.5.63-1 .04-1.77-1-2.41-1.92-1.3-1.9-2.29-5.36-.96-7.7.66-1.16 1.84-1.9 3.12-1.92.98-.02 1.9.66 2.5.66.6 0 1.72-.81 2.9-.69.49.02 1.87.2 2.76 1.5-.07.04-1.65.96-1.63 2.86zM14.3 6.36c.53-.64.89-1.53.79-2.42-.76.03-1.69.51-2.24 1.15-.49.57-.92 1.48-.8 2.35.85.07 1.72-.43 2.25-1.08z",
  },
  x: {
    label: "X",
    bg: "bg-black dark:bg-white",
    fg: "text-white dark:text-black",
    path: "M17.53 3H20.5l-6.49 7.42L21.5 21h-5.98l-4.68-6.13L5.4 21H2.43l6.94-7.93L2.5 3h6.13l4.23 5.6L17.53 3zm-1.05 16.2h1.65L7.6 4.7H5.83l10.65 14.5z",
  },
  wechat: {
    label: "微信",
    bg: "bg-[#07c160]",
    fg: "text-white",
    path: "M9.2 3C5.2 3 2 5.9 2 9.4c0 2 1.1 3.8 2.9 5L4.3 16.6l2.5-1.3c.8.2 1.6.3 2.4.3h.6a5.7 5.7 0 0 1-.2-1.5c0-3.3 3.1-6 7-6h.5C16.4 5.4 13.1 3 9.2 3zM7 6.7a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4.4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM16.3 9.5c-3.2 0-5.8 2.2-5.8 4.9s2.6 4.9 5.8 4.9c.7 0 1.4-.1 2-.3l2 1-.5-1.7c1.4-.9 2.3-2.3 2.3-3.9 0-2.7-2.6-4.9-5.8-4.9zm-2 2.6a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zm4 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z",
  },
};

/**
 * 第三方登录按钮：内置各平台品牌图形。
 * 不带 Logo 文字说明，仅展示图标 + 平台名。
 */
export function SocialButton({
  provider,
  label,
  className,
  onClick,
}: {
  provider: SocialProvider;
  label?: string;
  className?: string;
  onClick?: () => void;
}) {
  const p = PROVIDERS[provider];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-2lg px-3",
        p.bg,
        p.fg,
        "text-body-2-medium shadow-xs",
        "border border-border-button-default",
        "transition-[background-color,box-shadow,scale] duration-150 ease-out",
        "hover:shadow-sm active:scale-[0.99]",
        "outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2",
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="currentColor" aria-hidden="true">
        <path d={p.path} />
      </svg>
      <span>{label ?? `使用 ${p.label} 登录`}</span>
    </button>
  );
}
