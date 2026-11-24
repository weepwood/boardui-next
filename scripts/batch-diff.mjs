// 批量组件对比：原站 vs 本地，输出差异清单
import { spawn } from 'child_process';

const EDGE = '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge';
const ORIG = 'http://localhost:8899/zh-hans/components';
const MINE = 'http://127.0.0.1:3000/zh-hans/components';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 在页面中执行表达式 */
async function run(url, expr, port) {
  const proc = spawn(EDGE, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    `--remote-debugging-port=${port}`, '--window-size=1440,1200',
    `--user-data-dir=/tmp/vdiff-${port}-${Date.now()}`, url,
  ]);
  try {
    await sleep(6000);
    const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const pg = list.find((t) => t.type === 'page' && t.url.startsWith(url.slice(0, 40)));
    if (!pg) return { __err: 'NO_PAGE' };
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
    await sleep(3000);
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    ws.close();
    return r.result?.value ?? { __err: 'NO_RESULT' };
  } catch (e) {
    return { __err: String(e).slice(0, 60) };
  } finally {
    proc.kill();
  }
}

/**
 * 测量表达式：提取预览区里的"可交互控件"几何 + 样式签名
 * 返回按 size+radius 去重后的样式指纹数组
 */
const EXPR = `(async () => {
  await new Promise(r => setTimeout(r, 1200));
  const isVisible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 6 || r.height < 6) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.opacity === '0') return false;
    // 排除视觉隐藏（clip）元素
    if (cs.clip && cs.clip !== 'auto' && cs.clip.includes('rect(0')) return false;
    if (cs.position === 'absolute' && r.width <= 1 && r.height <= 1) return false;
    return true;
  };
  const norm = (v) => {
    if (v === 'none') return 'none';
    // 把颜色归一成 rgb()
    return v.replace(/lab\\([^)]+\\)/g, (m) => {
      const nums = m.match(/-?[\\d.]+/g);
      if (!nums) return m;
      // lab 近似转 rgb 太复杂，用数值指纹代替
      return 'lab(' + nums.slice(0,3).map(n => Math.round(+n)).join(',') + ')';
    }).replace(/\\s+/g, '');
  };
  const items = [];
  const seen = new Set();
  const sels = 'button,[role="switch"],[role="checkbox"],[role="radio"],[role="slider"],[role="tab"],input:not([type=hidden]),[role="progressbar"]';
  for (const el of document.querySelectorAll(sels)) {
    if (!isVisible(el)) continue;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const sig = {
      role: el.getAttribute('role') || el.tagName.toLowerCase(),
      w: Math.round(r.width), h: Math.round(r.height),
      radius: norm(cs.borderRadius) === '0px' ? '0' : (parseFloat(cs.borderRadius) > 100 ? 'full' : norm(cs.borderRadius)),
      bg: cs.backgroundImage === 'none' ? norm(cs.backgroundColor) : 'grad',
      border: cs.borderWidth === '0px' ? '0' : cs.borderWidth,
      font: cs.fontSize + '/' + cs.fontWeight,
    };
    const key = [sig.role, sig.w, sig.h, sig.radius, sig.border, sig.font].join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    items.push(sig);
  }
  items.sort((a,b) => (a.role+a.w+a.h).localeCompare(b.role+b.w+b.h));
  return items.slice(0, 25);
})()`;

const SLUGS = process.argv.slice(2);

const results = [];
for (let i = 0; i < SLUGS.length; i++) {
  const slug = SLUGS[i];
  const portBase = 9800 + i * 2;
  const [orig, mine] = await Promise.all([
    run(`${ORIG}/${slug}`, EXPR, portBase),
    run(`${MINE}/${slug}`, EXPR, portBase + 1),
  ]);

  const o = Array.isArray(orig) ? orig : [];
  const m = Array.isArray(mine) ? mine : [];
  const oMap = new Map(o.map((x) => [x.role + '|' + x.w + 'x' + x.h, x]));
  const mMap = new Map(m.map((x) => [x.role + '|' + x.w + 'x' + x.h, x]));
  const diffs = [];
  for (const [k, ov] of oMap) {
    const mv = mMap.get(k);
    if (!mv) { diffs.push({ type: 'missing', key: k }); continue; }
    for (const f of ['radius', 'bg', 'border', 'font']) {
      if (String(ov[f]) !== String(mv[f])) {
        diffs.push({ type: f, key: k, orig: String(ov[f]).slice(0, 40), mine: String(mv[f]).slice(0, 40) });
      }
    }
  }
  for (const k of mMap.keys()) {
    if (!oMap.has(k)) diffs.push({ type: 'extra', key: k });
  }
  results.push({ slug, origCount: o.length, mineCount: m.length, diffs: diffs.slice(0, 8) });
  console.error(`[${i+1}/${SLUGS.length}] ${slug}: 原站${o.length} 我的${m.length} 差异${diffs.length}`);
}

console.log(JSON.stringify(results, null, 1));
