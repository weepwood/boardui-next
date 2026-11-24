"use client";
import {useEffect,useRef,useState} from "react";
/** Measure the container, not the SVG, to avoid aspect-ratio feedback. */
export function useChartWidth(fallback:number,enabled=true){
 const ref=useRef<HTMLDivElement>(null);
 const [width,setWidth]=useState(fallback);
 useEffect(()=>{
  const node=ref.current;
  if(!node||!enabled)return;
  const measure=()=>{const next=Math.round(node.clientWidth);if(next>0)setWidth(old=>old===next?old:next)};
  measure();
  const observer=new ResizeObserver(measure);observer.observe(node);
  return ()=>observer.disconnect();
 },[enabled]);
 return {ref,width:Math.max(160,width)};
}
