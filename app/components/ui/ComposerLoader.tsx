"use client";
import { ComposerLoader as Core,type ComposerLoaderProps } from "@/packages/react/composer-loader";
import { AgentThinking } from "./AgentThinking";
export function ComposerLoader({text="正在思考",children,...props}:Omit<ComposerLoaderProps,"children">&{text?:string;children?:React.ReactNode}){
 return <Core {...props}>{children??<div className="flex h-[52px] items-center px-4"><AgentThinking text={text} showTimer={false}/></div>}</Core>;
}
