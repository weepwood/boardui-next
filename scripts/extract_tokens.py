#!/usr/bin/env python3
"""从原站 CSS 抽取完整设计系统，生成 Tailwind v4 主题文件。

输出:
  app/styles/tokens.css   - 设计令牌 (:root / .dark)
  app/styles/keyframes.css - 全部 @keyframes
"""
import re, glob, os, sys

SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "boardui", "site")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "app", "styles")


def load_css():
    files = sorted(
        glob.glob(os.path.join(SITE, "_next/static/immutable/chunks/*.css")),
        key=os.path.getsize, reverse=True)
    return "\n".join(open(f, encoding="utf-8", errors="ignore").read() for f in files)


PALETTE = re.compile(
    r'--color-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|'
    r'purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-\d+$')


def parse_scopes(css):
    """按 selector 归类所有令牌定义，区分亮/暗。"""
    light, dark = {}, {}
    TOKEN = re.compile(
        r'(--(?:color|shadow|radius|gradient)-[a-z0-9-]+)\s*:\s*([^;}]+)')
    for m in re.finditer(r'([^{}@]+)\{([^{}]+)\}', css):
        sel = m.group(1).strip()
        body = m.group(2)
        if '--' not in body:
            continue
        low = sel.lower()
        is_dark = ('.dark' in low) or ('prefers-color-scheme:dark' in low)
        is_root = (':root' in low) or low in ('html', ':host')
        if not (is_dark or is_root):
            continue
        for d in TOKEN.finditer(body):
            k, v = d.group(1), d.group(2).strip()
            # 跳过自引用
            if v == f'var({k})':
                continue
            if is_dark:
                dark.setdefault(k, v)
            else:
                light.setdefault(k, v)
    return light, dark


def collect(css, pattern):
    out = {}
    for m in re.finditer(r'(' + pattern + r')\s*:\s*([^;}]+)', css):
        out.setdefault(m.group(1), m.group(2).strip())
    return out


def extract_keyframes(css):
    out = {}
    for m in re.finditer(r'@keyframes\s+([a-zA-Z0-9_-]+)\s*\{', css):
        name = m.group(1)
        i = m.end() - 1
        depth, j = 0, i
        while j < len(css):
            if css[j] == '{':
                depth += 1
            elif css[j] == '}':
                depth -= 1
                if depth == 0:
                    break
            j += 1
        out.setdefault(name, f"@keyframes {name} {css[i:j + 1]}")
    return out


def main():
    os.makedirs(OUT, exist_ok=True)
    css = load_css()
    light, dark = parse_scopes(css)

    radius = collect(css, r'--radius-[a-z0-9-]+')
    shadow = collect(css, r'--shadow-[a-z0-9-]+')
    gradients = collect(css, r'--gradient-[a-z0-9-]+')
    fonts = collect(css, r'--font-[a-z0-9-]+')

    # ---- tokens.css ----
    # 关键：亮色令牌必须写进 @theme 块，Tailwind v4 才会据此生成
    # bg-*/text-*/border-*/rounded-*/shadow-* 等工具类。
    # 若写成普通 :root，变量存在但工具类不生成（类静默失效）。
    lines = ["/* 自动生成：设计令牌抽取自原站 CSS */",
             "/* 亮色 -> @theme（用于生成工具类）；暗色 -> .dark 覆盖 */", ""]

    def emit(vars_dict, selector):
        out = [f"{selector} {{"]
        for k, v in sorted(vars_dict.items()):
            out.append(f"  {k}: {v};")
        out.append("}")
        return "\n".join(out)

    # @theme 内不能有 var() 引用其他令牌的循环，先输出全部亮色令牌
    theme_lines = ["@theme {"]
    for k, v in sorted(light.items()):
        theme_lines.append(f"  {k}: {v};")
    theme_lines.append("}")
    lines.append("\n".join(theme_lines))
    lines.append("")
    lines.append("/* 暗色覆盖：.dark 下重新赋值，工具类引用同一变量即可自动切换 */")
    lines.append(emit(dark, ".dark"))
    lines.append("")

    with open(os.path.join(OUT, "tokens.css"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    # ---- keyframes.css ----
    kf = extract_keyframes(css)
    with open(os.path.join(OUT, "keyframes.css"), "w", encoding="utf-8") as f:
        f.write("/* 自动生成：全部 @keyframes，抽取自原站 CSS */\n\n")
        for name, body in sorted(kf.items()):
            f.write(body + "\n\n")

    print(f"tokens.css   : light={len(light)} dark={len(dark)}")
    print(f"keyframes.css: {len(kf)} 个动画")
    print(f"radius={len(radius)} shadow={len(shadow)} gradient={len(gradients)} font={len(fonts)}")


if __name__ == "__main__":
    main()
