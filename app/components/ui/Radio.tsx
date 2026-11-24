"use client";
import { RadioGroup as CoreRadioGroup, type RadioGroupProps } from "@/packages/react/radio";
import { Label } from "react-aria-components";
export { Radio, RadioDot } from "@/packages/react/radio";
export function RadioGroup({ label, children, ...props }: RadioGroupProps & { label?: string }) {
  return <CoreRadioGroup {...props}>{label && <Label className="text-body-2-medium text-text-primary">{label}</Label>}{children}</CoreRadioGroup>;
}
