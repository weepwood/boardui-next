"use client";
import {createContext,useContext} from "react";
export type Intent={href:string;label:string;from:string};
export const normalize=(href:string)=>href.replace(/\/$/,"")||"/";
export const NavContext=createContext<{begin:(href:string,label:string)=>void;warm:(href:string)=>void}>({begin:()=>{},warm:()=>{}});
export const useDocsNavigation=()=>useContext(NavContext);
