import Link from "next/link";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/** 面包屑：与原站一致的胶囊化样式 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="面包屑"
      className="flex w-full items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ol className="flex items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className={cn("flex items-center gap-1.5")}>
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className={cn(
                    "-mx-1 flex items-center gap-1.5 rounded-md px-1 py-0.5",
                    "text-caption-1-medium whitespace-nowrap text-text-tertiary",
                    "transition-colors duration-150 ease-out hover:text-text-primary"
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 text-caption-1-medium whitespace-nowrap text-text-secondary">
                  {item.label}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-text-tertiary">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
