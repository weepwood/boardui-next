"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggle: () => {},
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // 首次挂载时读取实际状态（由 head 内联脚本已设置）
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");
    setMounted(true);
  }, []);

  const applyTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    const update = () => {
      root.classList.toggle("dark", next === "dark");
      setThemeState(next);
      try {
        localStorage.setItem("boardui-theme", next);
      } catch {
        /* ignore */
      }
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsVT = "startViewTransition" in document;

    if (supportsVT && !reduce) {
      (document as unknown as {
        startViewTransition: (cb: () => void) => void;
      }).startViewTransition(update);
    } else {
      update();
    }
  }, []);

  const toggle = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme: applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
