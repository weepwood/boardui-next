"use client";
import { Announcement as Core } from "@/packages/react/announcement";
import { RiInformationLine,RiCheckboxCircleLine,RiAlertLine,RiErrorWarningLine } from "@remixicon/react";
export type AnnouncementVariant="info"|"success"|"warning"|"error";
const icons={info:RiInformationLine,success:RiCheckboxCircleLine,warning:RiAlertLine,error:RiErrorWarningLine};
export function Announcement({variant="info",title,description,action,onClose,className}:{variant?:AnnouncementVariant;title:string;description?:string;action?:React.ReactNode;onClose?:()=>void;className?:string}){
 return <Core title={title} description={description} icon={icons[variant]} extraAction={action} dismissible={!!onClose} onClose={onClose} closeLabel="关闭" role={variant==="error"?"alert":"status"} className={className}/>;
}
