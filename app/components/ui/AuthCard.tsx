"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "./Input";
import { Button } from "./Button";
import { SocialButton } from "./SocialButton";
import { Checkbox } from "./Checkbox";
import { Separator, TextField } from "react-aria-components";
import { Icon } from "./Icon";

/**
 * 身份验证卡片：登录 / 注册双模式，含第三方登录。
 */
export function AuthCard({ className }: { className?: string }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const isSignup = mode === "signup";
  const valid = email.includes("@") && password.length >= 6 && (!isSignup || agree);

  return (
    <div
      className={cn(
        "flex w-full max-w-[360px] flex-col gap-4 rounded-3xl border border-border-button-default",
        "bg-background-primary-default p-5 shadow-card",
        className
      )}
    >
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="flex size-9 items-center justify-center rounded-xl bg-text-primary text-[15px] font-bold text-background-full">
          B
        </span>
        <h3 className="text-title-3-semibold text-text-primary">
          {isSignup ? "创建账户" : "欢迎回来"}
        </h3>
        <p className="text-caption-1-regular text-text-tertiary">
          {isSignup ? "注册后即可使用全部组件" : "登录以继续你的工作"}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <SocialButton provider="google" label="使用 Google 继续" />
        <SocialButton provider="github" label="使用 GitHub 继续" />
      </div>

      <div className="flex items-center gap-2">
        <Separator className="h-px flex-1 bg-border-primary" />
        <span className="text-[10px] text-text-tertiary">或</span>
        <Separator className="h-px flex-1 bg-border-primary" />
      </div>

      <div className="flex flex-col gap-2.5">
        <Input
          label="邮箱"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          icon={<Icon name="mail-line" className="size-4" />}
        />
        <Input
          label="密码"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="至少 6 位"
          icon={<Icon name="lock-line" className="size-4" />}
          description={isSignup ? "建议包含字母与数字" : undefined}
        />
        {isSignup && (
          <Checkbox isSelected={agree} onChange={setAgree}>
            我已阅读并同意服务条款
          </Checkbox>
        )}
      </div>

      <Button isDisabled={!valid} className="w-full">
        {isSignup ? "注册" : "登录"}
      </Button>

      <button
        type="button"
        onClick={() => setMode(isSignup ? "signin" : "signup")}
        className="cursor-pointer text-center text-caption-1-regular text-text-secondary hover:text-text-primary"
      >
        {isSignup ? "已有账户？去登录" : "还没有账户？去注册"}
      </button>
    </div>
  );
}
