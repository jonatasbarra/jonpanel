#!/usr/bin/env bash
set -e

# ── JonPanel installer ────────────────────────────────────────────────────────

echo "==> JonPanel installer"
echo ""

INSTALL_DIR="$HOME/.local/share/jonpanel"
SCRIPT_DIR="$(cd "$(dirname "$(realpath "$0")")" && pwd)"

# ── 1. Arch Linux check ───────────────────────────────────────────────────────

if ! command -v pacman &>/dev/null; then
  echo "ERROR: JonPanel currently supports Arch Linux only."
  echo "Contributions for other distros are welcome."
  exit 1
fi

# ── 2. AUR helper detection ───────────────────────────────────────────────────

if command -v paru &>/dev/null; then
  AUR_HELPER="paru"
elif command -v yay &>/dev/null; then
  AUR_HELPER="yay"
else
  echo "ERROR: No AUR helper found. Please install paru or yay first."
  echo "  https://github.com/Morganamilo/paru"
  exit 1
fi

echo "==> Using AUR helper: $AUR_HELPER"
echo ""

# ── 3. Pacman dependencies ────────────────────────────────────────────────────

echo "==> Installing pacman dependencies..."

PACMAN_DEPS=(
  dart-sass
  brightnessctl
  power-profiles-daemon
  libgtop
  gtk4-layer-shell
)

sudo pacman -S --needed --noconfirm "${PACMAN_DEPS[@]}"

# ── 4. AUR dependencies ───────────────────────────────────────────────────────

echo ""
echo "==> Installing AUR dependencies via $AUR_HELPER..."

AUR_DEPS=(
  aylurs-gtk-shell-git
  libastal-gjs-git
  libastal-battery-git
  libastal-network-git
  libastal-bluetooth-git
  libastal-mpris-git
  libastal-notifd-git
  libastal-hyprland-git
  libastal-wireplumber-git
  libastal-tray-git
)

"$AUR_HELPER" -S --needed --noconfirm "${AUR_DEPS[@]}"

# ── 5. pnpm ───────────────────────────────────────────────────────────────────

echo ""
echo "==> Checking pnpm..."

command -v pnpm &>/dev/null || npm install -g pnpm

# ── 6. Install JS dependencies ────────────────────────────────────────────────

echo ""
echo "==> Installing JS dependencies..."

cd "$SCRIPT_DIR"
pnpm install --prefer-offline

# ── 7. Compile SCSS ───────────────────────────────────────────────────────────

echo ""
echo "==> Compiling SCSS..."

(cd "$SCRIPT_DIR" && sass style.scss style.css)

# ── 8. Install to $HOME/.local/share/jonpanel/ ────────────────────────────────

echo ""
echo "==> Installing jonpanel to $INSTALL_DIR..."

mkdir -p "$INSTALL_DIR"

if command -v rsync &>/dev/null; then
  rsync -a --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='@girs' \
    "$SCRIPT_DIR/" "$INSTALL_DIR/"
else
  cp -r "$SCRIPT_DIR/." "$INSTALL_DIR/"
fi

chmod +x "$INSTALL_DIR/launch.sh"

# ── 9. Enable power-profiles-daemon ──────────────────────────────────────────

echo ""
echo "==> Enabling power-profiles-daemon..."

sudo systemctl enable --now power-profiles-daemon

# ── 10. Done ──────────────────────────────────────────────────────────────────

echo ""
echo "✓ JonPanel installed to $INSTALL_DIR"
echo ""
echo "To autostart with Hyprland, add this line to your hyprland.conf:"
echo ""
echo "    exec-once = \$HOME/.local/share/jonpanel/launch.sh"
echo ""
echo "Then restart Hyprland or run the following to start immediately:"
echo ""
echo "    bash \$HOME/.local/share/jonpanel/launch.sh"
echo ""
