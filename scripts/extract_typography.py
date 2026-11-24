#!/usr/bin/env python3
"""生成 Tailwind v4 排版工具类。

原站用 .text-title-1-medium 这类复合类（字号 + 行高 + 字重 + 字距）。
Tailwind v4 的 --text-* 令牌可直接生成 text-<name> 工具类，
但需要把 --font-weight 子属性转成 --text-*--font-weight 的官方约定形式。
"""
import re, glob, os

SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "boardui", "site")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "app", "styles")


def main():
    files = sorted(
        glob.glob(os.path.join(SITE, "_next/static/immutable/chunks/*.css")),
        key=os.path.getsize, reverse=True)
    css = "\n".join(open(f, encoding="utf-8", errors="ignore").read() for f in files)

    vals = {}
    for m in re.finditer(r'(--text-[a-z0-9-]+)\s*:\s*([^;}]+)', css):
        vals.setdefault(m.group(1), m.group(2).strip())

    # Tailwind v4 已原生支持 --text-{name}--{line-height|letter-spacing|font-weight}
    lines = ["/* 自动生成：排版令牌（212 个），抽取自原站 CSS */",
             "@theme {"]
    for k in sorted(vals):
        lines.append(f"  {k}: {vals[k]};")
    lines.append("}")
    lines.append("")

    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, "typography.css"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"typography.css: {len(vals)} 个排版令牌")


if __name__ == "__main__":
    main()
