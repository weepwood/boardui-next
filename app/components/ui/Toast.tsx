"use client";
import { createContext,useCallback,useContext,useState,useId,useRef } from "react";
import { Notification, NotificationViewport } from "@/packages/react/notification";
type ToastKind="info"|"success"|"error";
type ToastItem={id:string;title:string;kind:ToastKind};
const ToastCtx=createContext<(title:string,kind?:ToastKind)=>void>(()=>{});
export function useToast(){return useContext(ToastCtx)}
export function ToastProvider({children}:{children:React.ReactNode}){
 const id=useId(),seq=useRef(0);const [items,setItems]=useState<ToastItem[]>([]);
 const push=useCallback((title:string,kind:ToastKind="info")=>{const key=id+"-"+(++seq.current);setItems(prev=>[...prev.slice(-3),{id:key,title,kind}])},[id]);
 return <ToastCtx.Provider value={push}>{children}<NotificationViewport aria-label="消息提示" position="bottom-center">{items.map(t=><Notification key={t.id} title={t.title} status={t.kind==="info"?"information":t.kind} autoDismissDuration={2600} introDelay={0} dismissible closeLabel="关闭消息" onDismiss={()=>setItems(prev=>prev.filter(i=>i.id!==t.id))}/>)}</NotificationViewport></ToastCtx.Provider>;
}
