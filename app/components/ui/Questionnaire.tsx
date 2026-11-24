"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { Progress } from "./Progress";

export type Question = {
  id: string;
  title: string;
  description?: string;
  type: "single" | "multi" | "text";
  options?: string[];
};

/**
 * 问卷：分步问答，带进度条与回退。
 */
export function Questionnaire({
  questions,
  onSubmit,
  className,
}: {
  questions: Question[];
  onSubmit?: (answers: Record<string, string | string[]>) => void;
  className?: string;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const q = questions[step];
  const last = step === questions.length - 1;
  const answered = answers[q.id] !== undefined && String(answers[q.id]).length > 0;

  const pick = (opt: string) => {
    if (q.type === "multi") {
      const prev = (answers[q.id] as string[]) ?? [];
      setAnswers({
        ...answers,
        [q.id]: prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt],
      });
    } else {
      setAnswers({ ...answers, [q.id]: opt });
    }
  };

  const selected = answers[q.id];

  return (
    <div
      className={cn(
        "flex w-full max-w-[440px] flex-col gap-3 rounded-2lg border border-border-button-default",
        "bg-background-primary-default p-4 shadow-card",
        className
      )}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-caption-2-regular text-text-tertiary">
          <span>
            第 {step + 1} / {questions.length} 题
          </span>
          <span className="tabular-nums">
            {Math.round(((step + 1) / questions.length) * 100)}%
          </span>
        </div>
        <Progress value={((step + 1) / questions.length) * 100} size="sm" />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-body-medium text-text-primary">{q.title}</span>
        {q.description && (
          <span className="text-caption-1-regular text-text-tertiary">{q.description}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {q.type === "text" ? (
          <textarea
            value={(answers[q.id] as string) ?? ""}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            rows={3}
            placeholder="输入你的回答…"
            className="resize-none rounded-2lg border border-border-button-default bg-background-primary-default px-2.5 py-2 text-body-2-regular text-text-primary outline-none placeholder:text-text-placeholder focus:ring-2 focus:ring-accent-500/30"
          />
        ) : (
          q.options?.map((opt) => {
            const on =
              q.type === "multi"
                ? (selected as string[] | undefined)?.includes(opt)
                : selected === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => pick(opt)}
                className={cn(
                  "flex items-center gap-2 rounded-2lg border px-2.5 py-2 text-start",
                  "text-body-2-medium transition-[border-color,background-color] duration-150 ease-out",
                  on
                    ? "border-accent-400 bg-badge-new-background text-text-primary"
                    : "border-border-button-default text-text-secondary hover:border-border-button-hover"
                )}
              >
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center",
                    q.type === "multi" ? "rounded-[4px]" : "rounded-full",
                    "border",
                    on ? "border-transparent bg-accent-500" : "border-border-button-default"
                  )}
                >
                  {on && <Icon name="check-line" className="size-2.5 text-white" />}
                </span>
                {opt}
              </button>
            );
          })
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border-primary pt-2.5">
        <Button
          size="sm"
          variant="ghost"
          isDisabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
        >
          上一题
        </Button>
        <Button
          size="sm"
          isDisabled={!answered}
          onClick={() => {
            if (last) onSubmit?.(answers);
            else setStep((s) => s + 1);
          }}
        >
          {last ? "提交" : "下一题"}
        </Button>
      </div>
    </div>
  );
}
