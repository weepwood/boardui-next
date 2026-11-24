import { cx } from "./cx";
export type FieldVisualState={isHovered?:boolean;isFocusWithin?:boolean;isDisabled?:boolean;isInvalid?:boolean};
export const fieldTransition="transition-[background-color,box-shadow,color] duration-[var(--input-transition-ms)] ease motion-reduce:transition-none";
export const fieldSurface=cx("flex min-h-9 min-w-0 items-center gap-2 rounded-2lg bg-background-tertiary-default px-2.5 py-1.5 ring-2 ring-inset ring-transparent",fieldTransition);
export const fieldText="min-w-0 flex-1 bg-transparent p-0 text-body-regular text-text-primary outline-none focus-visible:outline-none placeholder:text-text-tertiary focus:placeholder:text-text-primary disabled:cursor-not-allowed disabled:text-input-disabled-text disabled:placeholder:text-input-disabled-text";
export const fieldLabel="text-body-medium text-text-primary";
export function fieldVisualState({isHovered,isFocusWithin,isDisabled,isInvalid}:FieldVisualState){
 if(isDisabled)return "bg-input-disabled-background text-input-disabled-foreground cursor-not-allowed";
 if(isInvalid)return cx("bg-background-tertiary-error text-foreground-icon-error","ring-border-error-default",!isFocusWithin&&"ring-1");
 if(isFocusWithin)return "ring-border-focus-ring";
 if(isHovered)return "ring-1 ring-border-button-hover";
 return "";
}
export function fieldState(state:FieldVisualState){return cx(fieldSurface,fieldVisualState(state));}
