"use client";
import { SearchField as RACSearchField, Input, Button, Group, type SearchFieldProps } from "react-aria-components";
import { cx } from "@/packages/react/cx";
import { RiSearchLine, RiCloseLine } from "@remixicon/react";
export interface BSearchFieldProps extends Omit<SearchFieldProps,"className"|"children"> {
  placeholder?: string;
  className?: string;
}
export function SearchField({placeholder="搜索…",className,...props}:BSearchFieldProps) {
  return <RACSearchField {...props} aria-label={props["aria-label"] ?? placeholder} className={cx("group/search flex w-full flex-col gap-1",className)}>
    <Group className={({isHovered,isFocusWithin,isDisabled,isInvalid})=>cx(
      "flex h-9 min-w-0 items-center gap-2 rounded-full bg-background-tertiary-default px-3 text-foreground-icon-tertiary ring-2 ring-inset ring-transparent transition-[background-color,box-shadow,color] duration-[var(--input-transition-ms)] ease",
      isHovered&&!isFocusWithin&&!isDisabled&&!isInvalid&&"ring-border-button-hover",
      isFocusWithin&&!isDisabled&&!isInvalid&&"ring-border-button-active",
      isDisabled&&"bg-input-disabled-background text-input-disabled-foreground",
      isInvalid&&"bg-background-tertiary-error text-foreground-icon-error"
    )}>
      <RiSearchLine className="size-5 shrink-0" aria-hidden/>
      <Input placeholder={placeholder} className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-body-regular text-text-primary outline-none focus-visible:outline-none placeholder:text-text-tertiary disabled:cursor-not-allowed disabled:text-input-disabled-text [&::-webkit-search-cancel-button]:hidden"/>
      <Button aria-label="清除搜索" className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-background-tertiary-hover text-foreground-icon-secondary outline-none transition-colors duration-150 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring group-data-[empty]/search:hidden disabled:opacity-50">
        <RiCloseLine className="size-3.5" aria-hidden/>
      </Button>
    </Group>
  </RACSearchField>;
}
