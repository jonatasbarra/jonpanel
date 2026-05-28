import { createBinding } from "ags"
import Network from "gi://AstalNetwork"

export default function NetworkModule() {
  const network = Network.get_default()
  const wifi = network.wifi

  const icon = createBinding(wifi, "iconName").as(() => {
    const strength = wifi.strength
    if (strength > 75) return "󰤨"
    if (strength > 50) return "󰤥"
    if (strength > 25) return "󰤢"
    return "󰤟"
  })

  const ssid = createBinding(wifi, "ssid").as(
    (s: string | null) => s ?? "disconnected"
  )

  return (
    <box cssClasses={["network"]} spacing={4}>
      <label cssClasses={["network-icon"]} label={icon} />
      <label cssClasses={["network-label"]} label={ssid} />
    </box>
  )
}
