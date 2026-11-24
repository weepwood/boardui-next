import { cx } from "./cx";
export const fieldSurface="flex min-h-9 min-w-0 items-center gap-2 rounded-2lg bg-background-tertiary-default px-2.5 py-1.5 ring-2 ring-inset ring-transparent transition-[background-color,box-shadow,color] duration-150 ease motion-reduce:transition-none";
export const fieldText="min-w-0 flex-1 bg-transparent p-0 text-body-regular text-text-primary outline-none focus-visible:outline-none placeholder:text-text-tertiary";
export const fieldLabel="text-body-medium text-text-primary";
export function fieldState({isHovered,isFocusWithin,isDisabled,isInvalid}:{isHovered?:boolean;isFocusWithin?:boolean;isDisabled?:boolean;isInvalid?:boolean}){
 return cx(fieldSurface,isHovered&&!isFocusWithin&&!isDisabled&&!isInvalid&&"ring-border-button-hover",isFocusWithin&&!isDisabled&&!isInvalid&&"ring-border-button-active",isInvalid&&"bg-background-tertiary-error text-foreground-icon-error",isDisabled&&"bg-input-disabled-background text-input-disabled-foreground");
}
