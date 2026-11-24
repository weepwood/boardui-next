"use client";

import { useState,useId } from "react";
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
  const uid=useId();
  const current=Math.min(step,questions.length-1);
  const q=questions[current];
  if(!q)return <div role="status" className="p-6 text-text-secondary">暂无问题</div>;
  const last=current===questions.length-1;
  const answer=answers[q.id];
  const answered=Array.isArray(answer)?answer.length>0:!!answer?.trim();

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
        "flex w-full max-w-[440px] flex-col gap-3 rounded-2xl border border-border-component-detail-container",
        "bg-background-primary-default p-4 shadow-card",
        className
      )}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-caption-2-regular text-text-tertiary">
          <span>
            第 {current + 1} / {questions.length} 题
          </span>
          <span className="tabular-nums">
            {Math.round(((current + 1) / questions.length) * 100)}%
          </span>
        </div>
        <Progress value={((current + 1) / questions.length) * 100} size="sm" aria-label="问卷进度" />
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
            aria-label={q.title} value={(answers[q.id] as string) ?? ""}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            rows={3}
            placeholder="输入你的回答…"
            className="resize-none rounded-2xl border border-border-component-detail-container bg-background-primary-default px-2.5 py-2 text-body-2-regular text-text-primary outline-none placeholder:text-text-placeholder focus:ring-2 focus:ring-accent-500/30"
          />
        ) : (
          q.options?.map((opt) => {
            const on =
              q.type === "multi"
                ? (selected as string[] | undefined)?.includes(opt)
                : selected === opt;
            return (
              <label
                key={opt}
                className={cn(
                  "relative flex cursor-pointer items-center gap-2 rounded-2lg border px-2.5 py-2 text-start focus-within:ring-2 focus-within:ring-border-focus-ring",
                  "text-body-2-medium transition-[border-color,background-color] duration-150 ease-out",
                  on
                    ? "border-accent-400 bg-badge-new-background text-text-primary"
                    : "border-border-button-default text-text-secondary hover:border-border-button-hover"
                )}
              >
                <input type={q.type==="multi"?"checkbox":"radio"} name={uid+"-"+q.id} checked={!!on} onChange={()=>pick(opt)} className="sr-only"/>
                <span aria-hidden
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
              </label>
            );
          })
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-separator-border pt-2.5">
        <Button
          size="sm"
          variant="ghost"
          isDisabled={current === 0}
          onClick={() => setStep(current - 1)}
        >
          上一题
        </Button>
        <Button
          size="sm"
          isDisabled={!answered}
          onClick={() => {
            if (last) onSubmit?.(answers);
            else setStep(current + 1);
          }}
        >
          {last ? "提交" : "下一题"}
        </Button>
      </div>
    </div>
  );
}
