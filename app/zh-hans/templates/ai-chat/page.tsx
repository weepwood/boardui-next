import type { Metadata } from "next";
import { DocsLayout } from "@/app/components/docs/DocsLayout";
import { ChatTemplate } from "@/app/components/templates/ChatTemplate";

export const metadata: Metadata = { title: "AI 聊天模板" };

export default function ChatTemplatePage() {
  return (
    <DocsLayout
      variant="catalog"
      breadcrumbs={[
        { label: "BoardUI", href: "/" },
        { label: "模板", href: "/zh-hans/templates" },
        { label: "AI 聊天" },
      ]}
      toc={[
        { id: "preview", label: "预览" },
        { id: "notes", label: "实现说明" },
      ]}
    >
      <header className="flex flex-col gap-2">
        <h1 className="text-title-1-medium text-text-primary">AI 聊天</h1>
        <p className="text-headline-regular text-text-secondary">
          三段式 AI 对话界面：左侧会话列表、中间消息流、底部输入区。支持 Enter 发送、快捷提示胶囊与在线状态指示。
        </p>
      </header>

      <div id="preview" className="@container min-w-0 scroll-mt-14">
        <ChatTemplate />
      </div>

      <section id="notes" className="flex scroll-mt-14 flex-col gap-3">
        <h2 className="text-title-3-semibold text-text-primary">实现说明</h2>
        <ul className="flex flex-col gap-1.5 text-body-regular text-text-secondary">
          <li>· 消息流可真实输入并发送，Enter 发送、Shift+Enter 换行</li>
          <li>· 用户消息右对齐蓝色气泡，AI 消息左对齐浅灰气泡</li>
          <li>· 输入区带快捷提示胶囊，与主输入框组成复合组件</li>
          <li>· 消息列表独立滚动，不带动整页</li>
        </ul>
      </section>
    </DocsLayout>
  );
}
