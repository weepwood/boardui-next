"use client";
import { Button as RACButton, type ButtonProps as RACProps } from "react-aria-components";
import type { ReactNode, Ref } from "react";
import { cx } from "./cx";
import { buttonStyles as styles } from "../styles/button";
import type { ButtonSize, ButtonVariant, IconComponent } from "./button";
export interface AriaButtonProps extends Omit<RACProps,"children"|"className"> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  iconOnly?: boolean;
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
  children?: ReactNode;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}
export function AriaButton({size="medium",variant="primary",iconOnly=false,leadingIcon:Leading,trailingIcon:Trailing,children,className,ref,...props}:AriaButtonProps) {
  return <RACButton {...props} ref={ref} className={cx(styles.base, styles.size[size],styles.variant[variant],iconOnly && styles.iconOnlySize[size],className)}>
    {Leading && <Leading className={styles.icon[size]} aria-hidden/>}
    {!iconOnly && children != null && <span className={styles.label[size]}>{children}</span>}
    {!iconOnly && Trailing && <Trailing className={styles.icon[size]} aria-hidden/>}
  </RACButton>;
}
