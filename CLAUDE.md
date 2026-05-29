# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

**jonpanel** is a GTK4 desktop shell bar for Hyprland (Wayland), built with [AGS](https://github.com/Aylur/ags) (Aylur's GTK Shell). It uses TSX/JSX to define GTK widgets and reactive state via AGS's `createBinding`/`createComputed`/`createState` APIs. The compiled output is run by the `ags` CLI.

## Running

```bash
# Run directly (development)
ags run app.tsx --gtk 4

# Run via the launch script (used by systemd/autostart; sleeps 2s first)
bash launch.sh

# Logs go to /tmp/jonpanel.log when launched via launch.sh
```

There is no build step — AGS transpiles TypeScript/TSX on the fly. There is no test suite.

## SCSS compilation

SCSS must be pre-compiled to `style.css` before the panel picks it up. AGS does not compile SCSS automatically:

```bash
sass style.scss style.css
```

The entrypoint `style.scss` imports the theme and each widget's partial. All widget partials must also `@use "../../themes/tokyo-night" as *` to access theme variables.

## Architecture

```
app.tsx                      # Entry point — starts AGS, creates one Bar per monitor
widgets/
  bar/
    Bar.tsx                  # Root bar window (layer-shell, TOP anchor, EXCLUSIVE)
    bar.scss                 # Bar + all module styles
    modules/                 # One file per bar module
      Workspaces.tsx         # AstalHyprland — workspace buttons
      ActiveWindow.tsx       # Active window title
      Clock.tsx              # Time + date
      Battery.tsx            # AstalBattery — charge level + charging state
      Network.tsx            # AstalNetwork
      Bluetooth.tsx          # AstalBluetooth
      Media.tsx              # AstalMpris — now playing
      Powermenu.tsx          # systemctl poweroff (Rofi integration planned)
  controlcenter/
    ControlCenter.tsx        # Overlay panel (layer-shell, TOP|RIGHT, toggled by service)
services/
  controlcenter.ts           # Singleton visibility state; exports toggleCC/closeCC/getCCVisible
themes/
  tokyo-night.scss           # All SCSS color variables — must be the only source of colors
```

### Reactivity model

- `createBinding(gobject, "property")` — subscribes to a GObject property and returns a reactive value. Use `.as(fn)` to derive from it.
- `createComputed(() => expr)` — tracks reactive reads inside the callback (like a computed signal). Required when reading bindings from dynamic objects (e.g., the current media player).
- `createState(initial)` — returns `[getter, setter]` for plain reactive state (used in services).
- `<For each={binding}>` — reactive list renderer; re-renders items when the binding changes.

### Styling rules

- **No hardcoded hex colors** — always use a variable from `themes/tokyo-night.scss`.
- Each widget folder owns its SCSS partial; styles are imported into the top-level `style.scss`.
- The bar uses `JetBrainsMono Nerd Font` — icons are Nerd Font glyphs (Unicode codepoints), not icon names.

### GLib/GObject imports

System services come from GObject Introspection via `gi://Astal*` imports:

| Import | Service |
|---|---|
| `gi://AstalHyprland` | Hyprland IPC (workspaces, focused window) |
| `gi://AstalBattery` | UPower battery |
| `gi://AstalNetwork` | NetworkManager |
| `gi://AstalBluetooth` | Bluetooth adapter |
| `gi://AstalMpris` | MPRIS media players |

Type definitions for all GIR libraries live in `@girs/` at the project root — do not edit these.

### Adding a new bar module

1. Create `widgets/bar/modules/MyWidget.tsx` using `createBinding`/`createComputed` for reactivity.
2. Add styles to `widgets/bar/bar.scss` using only theme variables.
3. Import and place the component in `Bar.tsx` inside `<Left>`, `<Center>`, or `<Right>`.
4. Re-run `sass style.scss style.css` and restart the panel.

### Adding a new top-level window (e.g., a panel)

1. Create `widgets/<name>/<Name>.tsx` as a `<window>` using layer-shell anchors.
2. If it needs show/hide state, add a service under `services/<name>.ts` following the pattern in `services/controlcenter.ts`.
3. Mount the window in `app.tsx` alongside `Bar`.
