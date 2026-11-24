import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** 合并 className，后者的 Tailwind 冲突项覆盖前者 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
