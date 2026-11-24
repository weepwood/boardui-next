// 组件视觉对比：同时打开原站镜像与本地实现，逐项比对关键尺寸与样式
import { spawn } from 'child_process';

const EDGE = '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 在指定 URL 上执行探测表达式，返回结果 */
async function probe(url, expr, port) {
  const proc = spawn(EDGE, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    `--remote-debugging-port=${port}`, '--window-size=1440,1200',
    `--user-data-dir=/tmp/vc-${port}-${Date.now()}`, url,
  ]);
  try {
    await sleep(6500);
    const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const pg = list.find((t) => t.type === 'page' && t.url.includes(url.split('/')[2]));
    if (!pg) return { error: 'NO_PAGE' };
    const ws = new WebSocket(pg.webSocketDebuggerUrl);
    let id = 0;
    const pending = new Map();
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
    });
    await new Promise((r) => ws.addEventListener('open', r));
    const send = (method, params = {}) => new Promise((res) => {
      const i = ++id; pending.set(i, res);
      ws.send(JSON.stringify({ id: i, method, params }));
    });
    await sleep(2200);
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    ws.close();
    return r.result?.value ?? { error: 'NO_RESULT' };
  } catch (e) {
    return { error: String(e).slice(0, 80) };
  } finally {
    proc.kill();
  }
}

/** 通用测量表达式：抓取预览区里所有关键几何与样式 */
export const MEASURE_EXPR = `(() => {
  // 只测预览画布与各分节画布内的元素
  const canvases = [...document.querySelectorAll('[id="preview"], [id]')]
    .filter(el => el.querySelector('#preview') || el.id === 'preview' || /preview|installation|variants|sizes|states|disabled|icons/.test(el.id));
  const roots = canvases.length ? canvases : [document.body];

  const pick = (scope) => {
    const out = [];
    const seen = new Set();
    const els = scope.querySelectorAll('button, [role="switch"], [role="checkbox"], [role="radio"], [role="slider"], input, [role="tab"], [role="menuitem"]');
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      const cs = getComputedStyle(el);
      const key = Math.round(r.width) + 'x' + Math.round(r.height) + '|' + cs.borderRadius + '|' + cs.backgroundImage.slice(0,30);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute('role') || '',
        text: (el.textContent || '').trim().slice(0, 12),
        size: Math.round(r.width) + 'x' + Math.round(r.height),
        radius: cs.borderRadius,
        bg: cs.backgroundImage === 'none' ? cs.backgroundColor : 'gradient',
        font: cs.fontSize + '/' + cs.fontWeight,
        pad: cs.padding,
        border: cs.borderWidth,
        shadow: cs.boxShadow === 'none' ? 'none' : 'yes',
      });
    }
    return out;
  };

  const all = [];
  roots.forEach(rt => all.push(...pick(rt)));
  // 去重
  const uniq = new Map();
  all.forEach(x => uniq.set(x.tag + x.role + x.size + x.radius + x.font + x.text, x));
  return [...uniq.values()].slice(0, 40);
})()`;

export { probe, sleep };
