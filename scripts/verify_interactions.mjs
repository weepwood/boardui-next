// 通过 CDP 真实驱动浏览器，验证交互态与动效
import { spawn } from 'child_process';

const EDGE = '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge';
const URL = process.argv[2] || 'http://localhost:3100/zh-hans/kitchen-sink';

const proc = spawn(EDGE, [
  '--headless=new', '--disable-gpu', '--no-sandbox',
  '--remote-debugging-port=9444', '--window-size=1440,1000',
  '--user-data-dir=/tmp/cdp-profile-'+Date.now(),
  URL,
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(2500);

const targets = await (await fetch('http://127.0.0.1:9444/json/list')).json();
const pages = targets.filter((t) => t.type === 'page');
console.error('PAGE URLS:', pages.map(p => p.url));
const page = pages.find(t => t.url.includes('3100')) || pages[0];
const ws = new WebSocket(page.webSocketDebuggerUrl);

let id = 0;
const pending = new Map();
const events = [];

ws.addEventListener('message', (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result);
    pending.delete(msg.id);
    return;
  }
  if (msg.method) events.push(msg);
});

await new Promise((r) => ws.addEventListener('open', r));

function send(method, params = {}) {
  return new Promise((resolve) => {
    const myId = ++id;
    pending.set(myId, resolve);
    ws.send(JSON.stringify({ id: myId, method, params }));
  });
}

async function evalJs(expr) {
  const r = await send('Runtime.evaluate', {
    expression: expr, returnByValue: true, awaitPromise: true,
  });
  return r.result?.value;
}

await send('Page.enable');
await send('Runtime.enable');
await send('DOM.enable');

// 页面已在启动时加载
await sleep(3500);

const results = {};

// 2) 按钮基础状态
results.buttonBase = await evalJs(`
(() => {
  const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === '主要');
  if (!b) return 'NOT_FOUND';
  const cs = getComputedStyle(b);
  const r = b.getBoundingClientRect();
  return { w: Math.round(r.width), h: Math.round(r.height), radius: cs.borderRadius,
           bg: cs.backgroundImage.slice(0, 60), transition: cs.transitionDuration,
           timing: cs.transitionTimingFunction };
})()`);

// 3) 模拟按下，检查 data-pressed
const btnBox = await evalJs(`
(() => {
  const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === '主要');
  const r = b.getBoundingClientRect();
  return { x: r.x + r.width/2, y: r.y + r.height/2 };
})()`);

await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: btnBox.x, y: btnBox.y });
await sleep(180);
await send('Input.dispatchMouseEvent', {
  type: 'mousePressed', x: btnBox.x, y: btnBox.y, button: 'left', clickCount: 1,
});
await sleep(120);

results.pressedState = await evalJs(`
(() => {
  const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === '主要');
  const cs = getComputedStyle(b);
  return { hasPressedAttr: b.hasAttribute('data-pressed'),
           scale: cs.scale, transform: cs.transform,
           bg: cs.backgroundImage.slice(0, 70) };
})()`);

await send('Input.dispatchMouseEvent', {
  type: 'mouseReleased', x: btnBox.x, y: btnBox.y, button: 'left', clickCount: 1,
});
await sleep(200);

// 4) 点击开关，验证状态切换
results.switchToggle = await evalJs(`
(async () => {
  const sw = [...document.querySelectorAll('[role="switch"], input[type="checkbox"][role="switch"]')]
    .concat([...document.querySelectorAll('button[role="switch"]')]);
  const el = document.querySelector('[data-rac] [role="switch"]') ||
             [...document.querySelectorAll('*')].find(e => e.getAttribute('role') === 'switch');
  if (!el) return 'NO_SWITCH';
  const before = el.getAttribute('aria-checked') || el.getAttribute('data-selected');
  el.click();
  await new Promise(r => setTimeout(r, 400));
  const after = el.getAttribute('aria-checked') || el.getAttribute('data-selected');
  return { before, after, changed: before !== after };
})()`);

// 5) 复选框
results.checkboxToggle = await evalJs(`
(async () => {
  const els = [...document.querySelectorAll('[role="checkbox"]')];
  if (!els.length) return 'NO_CHECKBOX';
  const el = els.find(e => (e.textContent || '').includes('未选中')) || els[0];
  const before = el.getAttribute('aria-checked');
  el.click();
  await new Promise(r => setTimeout(r, 300));
  return { before, after: el.getAttribute('aria-checked'), count: els.length };
})()`);

// 6) 侧边栏折叠动效
results.sidebarCollapse = await evalJs(`
(async () => {
  const btns = [...document.querySelectorAll('th,button')].filter(b => {
    const t = (b.textContent || '').trim();
    return t === '快速入门' || t === '基础组件';
  });
  const b = btns[0];
  if (!b) return 'NO_GROUP';
  const panel = b.parentElement.querySelector('.grid');
  const before = panel ? getComputedStyle(panel).gridTemplateRows : 'none';
  b.click();
  await new Promise(r => setTimeout(r, 120));
  const mid = panel ? getComputedStyle(panel).gridTemplateRows : 'none';
  await new Promise(r => setTimeout(r, 400));
  const after = panel ? getComputedStyle(panel).gridTemplateRows : 'none';
  return { transitionProp: panel ? getComputedStyle(panel).transitionProperty : '',
           transitionDur: panel ? getComputedStyle(panel).transitionDuration : '',
           before, mid, after };
})()`);

// 7) 深色模式
results.darkMode = await evalJs(`
(async () => {
  document.documentElement.classList.add('dark');
  await new Promise(r => setTimeout(r, 300));
  const body = getComputedStyle(document.body);
  const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === '主要');
  return { bodyBg: body.backgroundColor, bodyColor: body.color,
           darkVar: getComputedStyle(document.documentElement).getPropertyValue('--color-background-full').trim() };
})()`);

console.log(JSON.stringify(results, null, 2));
ws.close();
proc.kill();
process.exit(0);
