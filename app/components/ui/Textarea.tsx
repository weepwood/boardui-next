"use client";
import { Textarea as CoreTextarea, type TextareaProps as CoreTextareaProps } from "@/packages/react/textarea";
export interface TextareaProps extends CoreTextareaProps {description?: string}
export function Textarea({description,hint,rows=4,...props}:TextareaProps) {
  return <CoreTextarea {...props} rows={rows} hint={hint ?? description}/>;
}
