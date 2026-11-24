"use client";
import { AgentThinking as Core,type AgentThinkingProps } from "@/packages/react/agent-thinking";
export function AgentThinking({text,label,...props}:AgentThinkingProps&{text?:string}){return <Core {...props} label={label??text??"正在分析你的请求"}/>;}
