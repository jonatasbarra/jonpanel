import { createBinding } from "ags"
import Battery from "gi://AstalBattery"

export default function BatteryModule() {
  const battery = Battery.get_default()
  const percentage = createBinding(battery, "percentage")
  const charging = createBinding(battery, "charging")

  const icon = percentage.as((p: number) => {
    if (p > 0.9) return "󰁹"
    if (p > 0.8) return "󰂂"
    if (p > 0.7) return "󰂁"
    if (p > 0.6) return "󰂀"
    if (p > 0.5) return "󰁿"
    if (p > 0.4) return "󰁾"
    if (p > 0.3) return "󰁽"
    if (p > 0.2) return "󰁼"
    if (p > 0.1) return "󰁻"
    return "󰁺"
  })

  const label = percentage.as((p: number) => `${Math.round(p * 100)}%`)

  return (
    <box cssClasses={["battery"]} spacing={4}>
      <label
        cssClasses={charging.as((c: boolean) =>
          c ? ["battery-icon", "charging"] : ["battery-icon"]
        )}
        label={charging.as((c: boolean) => (c ? "󰂄" : icon.peek()))}
      />
      <label cssClasses={["battery-label"]} label={label} />
    </box>
  )
}
