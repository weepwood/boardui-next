"use client";

import {useEffect,useState,type ReactNode} from "react";
import {I18nProvider} from "react-aria-components";

/**
 * Explicit URL-only audit mode. The default Chinese documentation stays LTR.
 * Change React Aria locale together with CSS direction (including portals).
 * The document language remains Chinese: this is a direction test, not a translation.
 */
export function AuditDirectionProvider({children}:{children:ReactNode}){
 const [rtl,setRtl]=useState(false);
 useEffect(()=>{
  if(new URLSearchParams(window.location.search).get("audit-direction")!=="rtl")return;
  const root=document.documentElement,previous=root.dir;
  root.dir="rtl";setRtl(true);
  return ()=>{root.dir=previous};
 },[]);
 return <I18nProvider locale={rtl?"ar":"zh-CN"}><div className="contents" dir={rtl?"rtl":"ltr"} data-audit-direction={rtl?"rtl":"ltr"}>{children}</div></I18nProvider>;
}
