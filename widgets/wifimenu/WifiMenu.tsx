import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import { createBinding, For } from "ags"
import Network from "gi://AstalNetwork"
import { getWifiMenuVisible, closeWifiMenu } from "../../services/wifimenu"

function signalIcon(strength: number): string {
  if (strength > 75) return "󰤨"
  if (strength > 50) return "󰤥"
  if (strength > 25) return "󰤢"
  return "󰤟"
}

function ApRow({ ap, wifi }: { ap: Network.AccessPoint; wifi: Network.Wifi }) {
  const isActive = createBinding(wifi, "activeAccessPoint").as(
    (aap: Network.AccessPoint | null) => aap?.bssid === ap.bssid
  )

  return (
    <button
      cssClasses={isActive.as((a: boolean) =>
        a ? ["wifi-ap-row", "active"] : ["wifi-ap-row"]
      )}
      onClicked={() => {
        if (isActive.peek()) wifi.deactivate_connection()
        else ap.activate(null)
        closeWifiMenu()
      }}
    >
      <box spacing={10}>
        <label cssClasses={["ap-icon"]} label={signalIcon(ap.strength)} />
        <label
          cssClasses={["ap-ssid"]}
          label={ap.ssid ?? "Hidden Network"}
          hexpand
          halign={Gtk.Align.START}
        />
        <label
          cssClasses={["ap-status"]}
          label={isActive.as((a: boolean) =>
            a ? "󰗠" : ap.requires_password ? "󰌾" : ""
          )}
        />
      </box>
    </button>
  )
}

export default function WifiMenu() {
  const { TOP, RIGHT, BOTTOM, LEFT } = Astal.WindowAnchor
  const network = Network.get_default()
  const wifi = network.wifi

  const sortedAPs = createBinding(wifi, "accessPoints").as(
    (aps: Network.AccessPoint[]) =>
      [...aps]
        .filter((ap) => ap.ssid)
        .sort((a, b) => b.strength - a.strength)
  )

  const _backdrop = (
    <window
      name="wifi-backdrop"
      cssClasses={["wifi-backdrop"]}
      anchor={TOP | RIGHT | BOTTOM | LEFT}
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.NORMAL}
      keymode={Astal.Keymode.NONE}
      visible={getWifiMenuVisible}
      application={app}
    >
      <button hexpand vexpand onClicked={closeWifiMenu} />
    </window>
  )

  return (
    <window
      name="wifi-menu"
      cssClasses={["wifi-menu"]}
      anchor={TOP | RIGHT}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.NORMAL}
      keymode={Astal.Keymode.ON_DEMAND}
      visible={getWifiMenuVisible}
      application={app}
    >
      <box vertical spacing={4}>
        <label cssClasses={["menu-header"]} label="Wi-Fi" halign={Gtk.Align.START} />
        <For each={sortedAPs}>
          {(ap: Network.AccessPoint) => <ApRow ap={ap} wifi={wifi} />}
        </For>
      </box>
    </window>
  )
}
