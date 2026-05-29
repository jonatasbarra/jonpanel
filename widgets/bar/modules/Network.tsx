import { createBinding } from "ags"
import Network from "gi://AstalNetwork"
import { toggleWifiMenu } from "../../../services/wifimenu"

const WIFI_ICONS = {
  connected:    ["󰤟", "󰤢", "󰤥", "󰤨"],
  disconnected: ["󰤠", "󰤣", "󰤦", "󰤩"],
}

function wifiStrengthIndex(strength: number): number {
  if (strength > 75) return 3
  if (strength > 50) return 2
  if (strength > 25) return 1
  return 0
}

export default function NetworkModule() {
  const network = Network.get_default()
  const wifi = network.wifi

  const icon = createBinding(wifi, "strength").as(() => {
    if (!wifi.enabled) return "󰤭"
    if (!wifi.ssid) return "󰤠"
    const hasInternet = network.connectivity === Network.Connectivity.FULL
    const idx = wifiStrengthIndex(wifi.strength)
    return hasInternet ? WIFI_ICONS.connected[idx] : WIFI_ICONS.disconnected[idx]
  })

  const connected = createBinding(wifi, "ssid").as((s: string | null) => !!s)
  const tooltip = createBinding(wifi, "ssid").as((s: string | null) => s ?? "Offline")

  return (
    <button
      cssClasses={["network"]}
      tooltipText={tooltip}
      onClicked={toggleWifiMenu}
    >
      <label
        cssClasses={connected.as((c: boolean) =>
          c ? ["network-icon"] : ["network-icon", "disconnected"]
        )}
        label={icon}
      />
    </button>
  )
}
