import { DirectionProvider } from "@/packages/react/direction";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "BoardUI — 组件库",
    template: "%s — BoardUI",
  },
  description:
    "面向 Web 应用与 AI 原生产品的组件库。基于 React Aria 构建，参考原站设计语言与交互，非官方预览组件库。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans" dir="ltr" suppressHydrationWarning>
      <head>
        {/* 主题初始化：在首屏绘制前应用，避免闪烁 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('boardui-theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full antialiased">
        <ThemeProvider><DirectionProvider locale="zh-CN">{children}</DirectionProvider></ThemeProvider>
      </body>
    </html>
  );
}
