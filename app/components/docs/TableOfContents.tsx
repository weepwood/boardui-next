"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "../ui/Icon";

export type TocItem = { id: string; label: string };

/**
 * 右侧目录：220px，左侧竖线，选中项 border-s-2 高亮。
 * 使用 IntersectionObserver 跟踪滚动位置。
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const anchorIntent = useRef<string | null>(null);
  const ids=JSON.stringify(items.map(item=>item.id));

  useEffect(() => {
    const headings=(JSON.parse(ids) as string[]).map(id=>document.getElementById(id)).filter((el):el is HTMLElement=>el!==null);
    if(!headings.length)return;
    anchorIntent.current = null;
    setActiveId(headings[0].id);
    const visible=new Set<Element>();
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries)if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target);
      // Use document order rather than repeatedly forcing bounding-box reads.
      const first=headings.find(heading=>visible.has(heading));
      if(first && !anchorIntent.current)setActiveId(first.id);
    },{rootMargin:"-80px 0px -60% 0px",threshold:0});
    headings.forEach(h=>observer.observe(h));
    const syncHash=()=>{
      const id=location.hash.slice(1);
      if(headings.some(h=>h.id===id)){anchorIntent.current=id;setActiveId(id);}
      else anchorIntent.current=null;
    };
    // Anchor navigation can trigger several intersections while the browser
    // resolves deferred section sizes. Keep explicit intent until the user
    // starts scrolling again, including keyboard and scrollbar navigation.
    const release=()=>{anchorIntent.current=null;};
    const onKey=(event:KeyboardEvent)=>{
      if(event.defaultPrevented || event.target instanceof Element && event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
      if(["ArrowUp","ArrowDown","PageUp","PageDown","Home","End"," "].includes(event.key))release();
    };
    const onPointer=(event:PointerEvent)=>{if(event.clientX>=document.documentElement.clientWidth)release();};
    syncHash();window.addEventListener("hashchange",syncHash);
    window.addEventListener("wheel",release,{passive:true});
    window.addEventListener("touchmove",release,{passive:true});
    window.addEventListener("keydown",onKey);
    window.addEventListener("pointerdown",onPointer);
    return ()=>{
      observer.disconnect();
      window.removeEventListener("hashchange",syncHash);
      window.removeEventListener("wheel",release);
      window.removeEventListener("touchmove",release);
      window.removeEventListener("keydown",onKey);
      window.removeEventListener("pointerdown",onPointer);
    };
  },[ids]);

  if (!items.length) return null;

  return (
    <aside className="hidden w-[220px] shrink-0 xl:block">
      <div className="sticky top-10 translate-y-0.5">
        <nav aria-label="在此页面上" className="flex flex-col gap-3">
          <p className="flex items-center gap-2 text-body-medium text-text-primary">
            <Icon name="list-check" className="size-4 text-text-secondary" />
            在此页面上
          </p>
          <ul className="flex flex-col border-s border-border-button-default">
            {items.map((item) => {
              const active = item.id === activeId;
              return (
                <li key={item.id} className="flex">
                  <a
                    href={`#${item.id}`} onClick={()=>{anchorIntent.current=item.id;setActiveId(item.id)}}
                    aria-current={active ? "location" : undefined}
                    className={cn(
                      "-ms-px w-full border-s-2 py-1.5 ps-3 text-body-2-regular",
                      "transition-colors duration-150 ease-out",
                      active
                        ? "border-accent-500 text-text-primary"
                        : "border-transparent text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
