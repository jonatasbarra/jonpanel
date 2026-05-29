#!/bin/bash
sleep 2
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"
export WAYLAND_DISPLAY="${WAYLAND_DISPLAY:-wayland-1}"
export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"
SCRIPT_DIR="$(cd "$(dirname "$(realpath "$0")")" && pwd)"
ags run "$SCRIPT_DIR/app.tsx" --gtk 4 >> /tmp/jonpanel.log 2>&1
