#!/bin/bash
# BoardUI 复刻工程启动脚本
cd "$(dirname "$0")" || exit 1
PORT=${1:-3000}

if [ ! -d "node_modules" ]; then
  echo "首次运行，安装依赖…"
  npm install --no-audit --no-fund
fi

echo ""
echo "  BoardUI 复刻工程"
echo "  ─────────────────────────────────────────"
echo "  组件实测:  http://localhost:$PORT/zh-hans/kitchen-sink"
echo "  按钮文档:  http://localhost:$PORT/zh-hans/components/button"
echo "  按 Ctrl+C 停止"
echo ""

( sleep 4; open "http://localhost:$PORT/zh-hans/kitchen-sink" ) &
exec npx next dev -p "$PORT"
