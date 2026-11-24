// 精确组件对比：只比对预览画布内的控件，输出可读的差异报告
import { spawn } from 'child_process';

const EDGE = '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge';
const ORIG = 'http://localhost:8899/zh-hans/components';
const MINE = 'http://127.0.0.1:3000/zh-hans/components';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run(url, expr, port) {
  const proc = spawn(EDGE, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    `--remote-debugging-port=${port}`, '--window-size=1440,1200',
    `--user-data-dir=/tmp/vp-${port}-${Date.now()}`, url,
  ]);
  try {
    await sleep(6000);
    const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const pg = list.find((t) => t.type === 'page' && t.url.startsWith(url.slice(0, 40)));
    if (!pg) return { __err: 'NO_PAGE' };
    const ws = new WebSocket(pg.webSocketDebuggerUrl);
    let id = 0; const pending = new Map();
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
    });
    await new Promise((r) => ws.addEventListener('open', r));
    const send = (method, params = {}) => new Promise((res) => {
      const i = ++id; pending.set(i, res);
      ws.send(JSON.stringify({ id: i, method, params }));
    });
    await sleep(3200);
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    ws.close();
    return r.result?.value ?? { __err: 'NO_RESULT' };
  } catch (e) {
    return { __err: String(e).slice(0, 60) };
  } finally { proc.kill(); }
}

/**
 * 只取预览画布内的控件。
 * 定位方式：找到包含"预览"tab 的容器，取其下方的画布 DOM。
 */
const EXPR = `(async () => {
  await new Promise(r => setTimeout(r, 1500));

  // 1) 找所有画布：原站是 #preview 下的 div，本地是圆角卡片
  const canvases = [];
  // 原站
  const pv = document.getElementById('preview');
  if (pv) canvases.push(pv);
  // 分节画布（带 #variants / #sizes 等 id 的 section）
  document.querySelectorAll('section[id], div[id]').forEach(s => {
    if (/^(variants|sizes|states|disabled|icons|installation|with-icon|small|four|vertical|range)$/.test(s.id)) canvases.push(s);
  });
  // 本地兜底：预览/代码切换条下方的元素
  if (!canvases.length) {
    document.querySelectorAll('button[role="tab"]').forEach(t => {
      const wrap = t.closest('div')?.parentElement;
      if (wrap) canvases.push(wrap);
    });
  }

  const isVisible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 6 || r.height < 6) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.opacity === '0') return false;
    if (cs.position === 'absolute' && r.width <= 1 && r.height <= 1) return false;
    return true;
  };

  const norm = (v) => String(v).replace(/\\s+/g, '').replace(/lab\\([^)]*\\)/g, 'lab');

  const sig = (el) => {
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    return {
      role: el.getAttribute('role') || el.tagName.toLowerCase(),
      w: Math.round(r.width), h: Math.round(r.height),
      radius: parseFloat(cs.borderRadius) > 100 ? 'full' : (cs.borderRadius === '0px' ? '0' : norm(cs.borderRadius)),
      bg: cs.backgroundImage !== 'none' ? 'grad' : norm(cs.backgroundColor),
      border: cs.borderWidth === '0px' ? '0' : cs.borderWidth,
      font: cs.fontSize + '/' + cs.fontWeight,
    };
  };

  const items = []; const seen = new Set();
  const SEL = 'button,[role="switch"],[role="checkbox"],[role="radio"],[role="slider"],[role="progressbar"],input:not([type=hidden])';
  // 页面级工具栏（预览/代码切换、安装包管理器、侧边栏搜索等），不属于组件本身
  const isToolbar = (el) => {
    if (el.closest('[role="tablist"]')) return true;       // 预览/代码 切换
    if (el.closest('nav')) return true;                     // 侧边栏/TOC
    if (el.closest('header')) return true;                  // 顶栏
    const t = (el.textContent || '').trim();
    if (/^(预览|代码|复制代码|复制页面|npm|pnpm|yarn)$/.test(t)) return true;
    return false;
  };
  for (const cv of canvases) {
    for (const el of cv.querySelectorAll(SEL)) {
      if (!isVisible(el)) continue;
      if (isToolbar(el)) continue;
      // 排除视觉隐藏的原生 input（被 label 包裹的）
      if (el.tagName === 'INPUT' && el.closest('span[style*="clip"]')) continue;
      const s = sig(el);
      const key = [s.role, s.w, s.h].join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(s);
    }
  }
  items.sort((a, b) => (a.role + a.w + 'x' + a.h).localeCompare(b.role + b.w + 'x' + b.h));
  return items.slice(0, 20);
})()`;

const SLUGS = process.argv.slice(2);
const report = [];

for (let i = 0; i < SLUGS.length; i++) {
  const slug = SLUGS[i];
  const base = 9900 + i * 2;
  const [o, m] = await Promise.all([
    run(`${ORIG}/${slug}`, EXPR, base),
    run(`${MINE}/${slug}`, EXPR, base + 1),
  ]);
  const oa = Array.isArray(o) ? o : [];
  const ma = Array.isArray(m) ? m : [];
  const om = new Map(oa.map((x) => [x.role + '|' + x.w + 'x' + x.h, x]));
  const mm = new Map(ma.map((x) => [x.role + '|' + x.w + 'x' + x.h, x]));

  const diffs = [];
  for (const [k, ov] of om) {
    const mv = mm.get(k);
    if (!mv) { diffs.push(`  缺失: ${k} (原站 radius=${ov.radius} bg=${ov.bg} font=${ov.font})`); continue; }
    const fields = [];
    if (ov.radius !== mv.radius) fields.push(`圆角 ${ov.radius} → ${mv.radius}`);
    if (ov.bg !== mv.bg) fields.push(`背景 ${ov.bg} → ${mv.bg}`);
    if (ov.border !== mv.border) fields.push(`描边 ${ov.border} → ${mv.border}`);
    if (ov.font !== mv.font) fields.push(`字体 ${ov.font} → ${mv.font}`);
    if (fields.length) diffs.push(`  差异: ${k}  ${fields.join('; ')}`);
  }
  for (const k of mm.keys()) if (!om.has(k)) diffs.push(`  多余: ${k}`);

  report.push({ slug, oCount: oa.length, mCount: ma.length, diffs });
  console.log(`\n[${i + 1}/${SLUGS.length}] ${slug}  原站${oa.length}项 我的${ma.length}项 差异${diffs.length}`);
  diffs.slice(0, 6).forEach((d) => console.log(d));
}

// 汇总
const bad = report.filter((r) => r.diffs.length > 0);
console.log(`\n===== 汇总 =====`);
console.log(`共比对 ${report.length} 个组件，有差异 ${bad.length} 个`);
if (bad.length) console.log('有差异: ' + bad.map((b) => b.slug).join(', '));
