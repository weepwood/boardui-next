"use client";
import { Input as CoreInput, type InputProps as CoreInputProps } from "@/packages/react/input";
/** Preserve the original string/ReactNode adapter API for existing applications. */
export interface InputProps extends CoreInputProps {
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
  description?: string;
  invalidMessage?: string;
}
export function Input({icon,suffix,description,invalidMessage,hint,leadingAddon,trailingAddon,...props}:InputProps) {
  return <CoreInput {...props} leadingAddon={leadingAddon ?? icon} trailingAddon={trailingAddon ?? suffix}
    hint={props.isInvalid ? invalidMessage ?? hint ?? description : hint ?? description}/>;
}
