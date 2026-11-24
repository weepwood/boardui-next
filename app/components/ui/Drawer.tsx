"use client";
import { ModalOverlay, Modal, Dialog, Heading } from "react-aria-components";
import { CloseButton } from "@/packages/react/close-button";
import { MODAL_BACKDROP } from "@/packages/react/overlay-styles";
import { cx } from "@/packages/react/cx";
export function Drawer({isOpen,onClose,title,description,side="right",width=400,children,footer}:{isOpen:boolean;onClose:()=>void;title:string;description?:string;side?:"left"|"right";width?:number;children:React.ReactNode;footer?:React.ReactNode}){
 return <ModalOverlay isOpen={isOpen} onOpenChange={open=>{if(!open)onClose()}} isDismissable className={cx(MODAL_BACKDROP,"flex p-2 sm:p-3",side==="left"?"justify-start":"justify-end")} dir="ltr">
 <Modal style={{width,maxWidth:"calc(100vw - 16px)"}} className={cx("h-full outline-none transition-[translate,opacity] duration-300 ease-bui motion-reduce:transition-none",side==="left"?"data-[entering]:-translate-x-full data-[exiting]:-translate-x-full":"data-[entering]:translate-x-full data-[exiting]:translate-x-full")}>
 <Dialog className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default shadow-dropdown outline-none">
 <header className="flex shrink-0 items-start gap-3 border-b border-separator-border p-5"><div className="flex min-w-0 flex-1 flex-col gap-1"><Heading slot="title" className="text-headline-medium text-text-primary">{title}</Heading>{description&&<p className="text-body-regular text-text-secondary">{description}</p>}</div><CloseButton aria-label="关闭" size="md" onClick={onClose}/></header>
 <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">{children}</div>
 {footer&&<footer className="flex shrink-0 items-center justify-end gap-2 border-t border-separator-border p-5">{footer}</footer>}
 </Dialog></Modal></ModalOverlay>;
}
