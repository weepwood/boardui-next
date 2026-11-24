"use client";
import { Notification as Core } from "@/packages/react/notification";
export type NotificationVariant="information"|"success"|"error";
export function Notification({variant="information",title,description,action,onClose,className}:{variant?:NotificationVariant;title:string;description?:string;action?:React.ReactNode;onClose?:()=>void;className?:string}){
 return <Core status={variant} title={title} description={description} extraAction={action} dismissible={!!onClose} onDismiss={onClose} closeLabel="关闭" className={className}/>;
}
