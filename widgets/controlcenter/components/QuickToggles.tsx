import { createBinding, createComputed, createState } from "ags"
import { createPoll } from "ags/time"
import { execAsync } from "ags/process"
import { Gtk } from "ags/gtk4"
import Network from "gi://AstalNetwork"
import Bluetooth from "gi://AstalBluetooth"

// DND singleton — exported for use in future notification integration
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
      orientation={Gtk.Orientation.VERTICAL}
      spacing={8}
    >
      <box spacing={8} homogeneous>
        {/* WiFi */}
        <button
          cssClasses={["qt-toggle"]}
          hexpand
          onClicked={() => { if (wifi) wifi.enabled = !wifi.enabled }}
        >
          <box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
            <label
              cssClasses={createComputed(() =>
                wifiOn() ? ["qt-icon", "active"] : ["qt-icon"]
              )}
              label={createComputed(() => (wifiOn() ? "󰤨" : "󰤭"))}
            />
            <label cssClasses={["qt-label"]} label="WiFi" />
          </box>
        </button>

        {/* Bluetooth */}
        <button
          cssClasses={["qt-toggle"]}
          hexpand
          onClicked={() => bluetooth.toggle()}
        >
          <box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
            <label
              cssClasses={btOn.as((e: boolean) =>
                e ? ["qt-icon", "active"] : ["qt-icon"]
              )}
              label={btOn.as((e: boolean) => (e ? "󰂯" : "󰂲"))}
            />
            <label cssClasses={["qt-label"]} label="Bluetooth" />
          </box>
        </button>
      </box>

      <box spacing={8} homogeneous>
        {/* Do Not Disturb */}
        <button
          cssClasses={["qt-toggle"]}
          hexpand
          onClicked={() => setDnd(!dnd())}
        >
          <box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
            <label
              cssClasses={createComputed(() =>
                dnd() ? ["qt-icon", "active"] : ["qt-icon"]
              )}
              label={createComputed(() => (dnd() ? "󰂛" : "󰂚"))}
            />
            <label cssClasses={["qt-label"]} label="Do Not Disturb" />
          </box>
        </button>

        {/* Power Profile */}
        <button
          cssClasses={["qt-toggle"]}
          hexpand
          onClicked={cycleProfile}
        >
          <box orientation={Gtk.Orientation.VERTICAL} spacing={4}>
            <label
              cssClasses={["qt-icon", "active"]}
              label={createComputed(() => PROFILE_ICONS[profile()] ?? "󰾆")}
            />
            <label cssClasses={["qt-label"]} label={profileLabel} />
          </box>
        </button>
      </box>
    </box>
  )
}
