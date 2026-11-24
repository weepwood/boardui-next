"use client";
import { ComboBox, Input, Button, Group, ListBox, ListBoxItem, Label, type ComboBoxProps } from "react-aria-components";
import { cx } from "@/packages/react/cx";
import { MENU_ITEM, MENU_ITEMS_CONTAINER } from "@/packages/react/menu-styles";
import { Popover } from "./Popover";
import { Icon } from "./Icon";
import { ChevronDownSmall } from "@/packages/react/chevrons";
type Option={id:string;label:string};
export interface BComboboxProps extends Omit<ComboBoxProps<Option>,"className"|"children"> {label?:string;placeholder?:string;options:Option[];className?:string}
export function Combobox({label,placeholder="搜索或选择…",options,className,...props}:BComboboxProps){
 return <ComboBox {...props} defaultItems={options} aria-label={props["aria-label"]??(!label?placeholder:undefined)} className={cx("group flex w-full flex-col gap-1",className)}>
 {label&&<Label className="text-body-medium text-text-primary">{label}</Label>}
 <Group className={({isFocusWithin,isHovered,isDisabled,isInvalid})=>cx("flex h-9 min-w-0 items-center gap-2 rounded-2lg bg-background-tertiary-default p-2 ring-2 ring-inset ring-transparent transition-[background-color,box-shadow] duration-150",isHovered&&!isFocusWithin&&!isDisabled&&!isInvalid&&"ring-border-button-hover",isFocusWithin&&!isDisabled&&!isInvalid&&"ring-border-button-active",isDisabled&&"bg-input-disabled-background",isInvalid&&"bg-background-tertiary-error")}>
 <Icon name="search-line" className="size-5 text-foreground-icon-tertiary"/>
 <Input placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-body-regular text-text-primary outline-none focus-visible:outline-none placeholder:text-text-tertiary disabled:cursor-not-allowed"/>
 <Button aria-label="展开选项" className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"><ChevronDownSmall className="size-4 transition-transform duration-200 group-data-[open]:rotate-180"/></Button>
 </Group><Popover className="w-[var(--trigger-width)]"><ListBox<Option> className={cx(MENU_ITEMS_CONTAINER,"max-h-60 overflow-auto")} renderEmptyState={()=> <span className="p-2 text-body-regular text-text-tertiary">无匹配项</span>}>{o=><ListBoxItem id={o.id} textValue={o.label} className={cx(MENU_ITEM,"text-body-medium data-[focused]:bg-dropdown-item-hover-background data-[selected]:bg-dropdown-item-hover-background data-[disabled]:opacity-50")}>{o.label}</ListBoxItem>}</ListBox></Popover></ComboBox>;
}
