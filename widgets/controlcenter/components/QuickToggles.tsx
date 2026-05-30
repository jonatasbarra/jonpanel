import { createBinding, createComputed, createState } from "ags"
import { createPoll } from "ags/time"
import { execAsync } from "ags/process"
import { Gtk } from "ags/gtk4"
import Network from "gi://AstalNetwork"
import Bluetooth from "gi://AstalBluetooth"

// Local DND state — keeps the control center stable even if the notification
// daemon proxy does not expose a writable dnd property in this runtime.
const [dnd, setDnd] = createState(false)
export const getDND = dnd

const PROFILES = ["performance", "balanced", "power-saver"] as const
type Profile = (typeof PROFILES)[number]

const PROFILE_ICONS: Record<Profile, string> = {
  performance: "󰓅",
  balanced: "󰾆",
  "power-saver": "󰾅",
}

export default function QuickToggles() {
  // ── WiFi ─────────────────────────────────────────────────────────────────
  const network = Network.get_default()
  const wifi = network.get_wifi()
  const wifiOn = createComputed(() => (wifi ? createBinding(wifi, "enabled")() : false))

  // ── Bluetooth ─────────────────────────────────────────────────────────────
  const bluetooth = Bluetooth.get_default()
  const btOn = createBinding(bluetooth, "isPowered")

  // ── Power profile ─────────────────────────────────────────────────────────
  const rawProfile = createPoll("balanced", 2000, "powerprofilesctl get")
  const profile = createComputed(() => rawProfile().trim() as Profile)

  function cycleProfile() {
    const next = PROFILES[(PROFILES.indexOf(profile()) + 1) % PROFILES.length]
    execAsync(["powerprofilesctl", "set", next]).catch(console.error)
  }

  // ── Derived labels ────────────────────────────────────────────────────────
  const profileLabel = createComputed(() => {
    const p = profile()
    if (p === "performance") return "Performance"
    if (p === "power-saver") return "Power Saver"
    return "Balanced"
  })

  return (
    <box
      cssClasses={["quick-toggles"]}
      spacing={4}
    >
      <button
        cssClasses={["qt-toggle"]}
        hexpand
        onClicked={() => { if (wifi) wifi.enabled = !wifi.enabled }}
      >
        <label
          cssClasses={createComputed(() =>
            wifiOn() ? ["qt-icon", "active"] : ["qt-icon"]
          )}
          label={createComputed(() => (wifiOn() ? "󰤨" : "󰤭"))}
        />
      </button>

      <button
        cssClasses={["qt-toggle"]}
        hexpand
        onClicked={() => bluetooth.toggle()}
      >
        <label
          cssClasses={btOn.as((e: boolean) =>
            e ? ["qt-icon", "active"] : ["qt-icon"]
          )}
          label={btOn.as((e: boolean) => (e ? "󰂯" : "󰂲"))}
        />
      </button>

      <button
        cssClasses={["qt-toggle"]}
        hexpand
        onClicked={() => setDnd(!dnd())}
      >
        <label
          cssClasses={createComputed(() =>
            dnd() ? ["qt-icon", "active"] : ["qt-icon"]
          )}
          label={createComputed(() => (dnd() ? "󰂛" : "󰂚"))}
        />
      </button>

      <button
        cssClasses={["qt-toggle"]}
        hexpand
        onClicked={cycleProfile}
      >
        <label
          cssClasses={["qt-icon", "active"]}
          label={createComputed(() => PROFILE_ICONS[profile()] ?? "󰾆")}
        />
      </button>
    </box>
  )
}
