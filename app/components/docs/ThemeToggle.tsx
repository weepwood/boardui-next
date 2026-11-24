"use client";

import { useTheme } from "../ThemeProvider";
import { Icon } from "../ui/Icon";
import { cn } from "@/lib/utils";

/** 主题切换按钮：与原站 size-9 rounded-2lg 一致 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "切换到亮色模式" : "切换到暗色模式"}
      className={cn(
        "flex size-9 cursor-pointer items-center justify-center rounded-2lg",
        "text-foreground-icon-secondary transition-colors duration-150 ease-out",
        "hover:bg-background-secondary-hover hover:text-foreground-icon-primary"
      )}
    >
      <Icon
        name={isDark ? "sun-line" : "moon-line"}
        className="size-4 transition-transform duration-300 ease-bui"
      />
    </button>
  );
}
