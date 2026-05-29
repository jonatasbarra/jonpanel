# Changelog

All notable changes to JonPanel are documented here.

---

## [v1.0-launch] — 2026-05-29

### Added
- `install.sh` — one-command installer for Arch Linux (AUR helper detection, pacman + AUR deps, SCSS compile, rsync to `~/.local/share/jonpanel/`)
- `README.md` with screenshots, installation guide, and development docs
- `LICENSE` — MIT
- `assets/` — bar and control center screenshots

### Fixed
- `install.sh`: added `rsync` to pacman deps; fixed `cp` fallback to exclude `.git`, `node_modules`, `@girs`
- `launch.sh`: replaced hardcoded `/home/jon/projects/jonpanel/app.tsx` with `$SCRIPT_DIR`-relative path
- `launch.sh`: replaced hardcoded `/run/user/1000` with `/run/user/$(id -u)`
- `launch.sh`: removed stale `pkill -f swaync` left over from Swaync removal
- `package.json`: removed `ags` and `gnim` entries — they are AUR symlinks, not npm packages

---

## [v0.3-osd] — 2026-05-29

### Added
- `services/osd.ts` — OSD state with debounce via `GLib.source_remove`
- `widgets/osd/OSD.tsx` — centered volume and brightness overlay (layer shell, no anchor)
- Volume OSD triggered via `GObject.connect("notify::volume")` — synchronous, fires on keybind
- Brightness OSD triggered via `createPoll` with external-change detection

---

## [v0.2-control-center] — 2026-05-28

### Added
- `widgets/controlcenter/ControlCenter.tsx` — overlay panel (layer shell TOP+RIGHT, toggled by clock click)
- `services/controlcenter.ts` — singleton visibility state (`toggleCC`, `closeCC`, `getCCVisible`)
- `VolumeSlider.tsx` — reactive slider via `AstalWp`, icon changes by level
- `BrightnessSlider.tsx` — reads/writes via `brightnessctl`; `lastWritten` guard prevents poll→write loop
- `QuickToggles.tsx` — Wi-Fi, Bluetooth, Do Not Disturb, Power Profile toggles
- `NotificationList.tsx` — reactive list with `<For>`, DND banner, empty state
- `widgets/notifications/` — floating popups: auto-dismiss 4s, max 3 visible, manual dismiss

### Removed
- Swaync dependency — `astal-notifd` now registers `org.freedesktop.Notifications` on D-Bus

---

## [v0.1-bar] — 2026-05-27

### Added
- Full-width top bar with blur (via Hyprland `layerrule`) and Tokyo Night semi-transparent background
- Three-zone layout: `[workspaces | active window] ←→ [tray | media | bt | net | battery | volume | clock | powermenu]`
- `Workspaces.tsx` — reactive workspace buttons via `AstalHyprland` and `<For>`
- `ActiveWindow.tsx` — active window title via `createBinding`
- `Clock.tsx` — time and date via `createPoll`
- `Battery.tsx` — charge level and charging state via `AstalBattery`
- `Network.tsx` — Wi-Fi status via `AstalNetwork`
- `Bluetooth.tsx` — adapter state via `AstalBluetooth`
- `Volume.tsx` — current level via `AstalWp`
- `Tray.tsx` — system tray via `AstalTray`
- `Media.tsx` — now-playing title and playback status via `AstalMpris` with `createComputed`
- `Powermenu.tsx` — systemctl poweroff button
- `themes/tokyo-night.scss` — full color variable set; only source of colors across the project
- `launch.sh` — Hyprland autostart wrapper with log to `/tmp/jonpanel.log`
