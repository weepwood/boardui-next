"use client";
import { SearchField as RACSearchField, Input, Button, Group, type SearchFieldProps } from "react-aria-components";
import { fieldState,fieldText } from "@/packages/react/field-styles";
import { cx } from "@/packages/react/cx";
import { RiSearchLine, RiCloseLine } from "@remixicon/react";
export interface BSearchFieldProps extends Omit<SearchFieldProps,"className"|"children"> {
  placeholder?: string;
  className?: string;
}
export function SearchField({placeholder="搜索…",className,...props}:BSearchFieldProps) {
  return <RACSearchField {...props} aria-label={props["aria-label"] ?? placeholder} className={cx("group/search flex w-full flex-col gap-1",className)}>
    <Group className={state=>cx("text-foreground-icon-tertiary",fieldState(state),"h-9 rounded-full px-3")}>
      <RiSearchLine className="size-5 shrink-0" aria-hidden/>
      <Input placeholder={placeholder} className={cx(fieldText,"border-0 font-sans [&::-webkit-search-cancel-button]:hidden")}/>
      <Button aria-label="清除搜索" className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-background-tertiary-hover text-foreground-icon-secondary outline-none transition-colors duration-150 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring group-data-[empty]/search:hidden disabled:opacity-50">
        <RiCloseLine className="size-3.5" aria-hidden/>
      </Button>
    </Group>
  </RACSearchField>;
}
