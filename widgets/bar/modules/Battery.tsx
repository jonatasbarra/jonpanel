import { createBinding, createComputed } from "ags"
import Battery from "gi://AstalBattery"

function batteryIcon(percentage: number, charging: boolean): string {
  if (charging) {
    if (percentage > 0.9) return "󰂅"
    if (percentage > 0.8) return "󰂋"
    if (percentage > 0.7) return "󰂊"
    if (percentage > 0.6) return "󰢞"
    if (percentage > 0.5) return "󰂉"
    if (percentage > 0.4) return "󰢝"
    if (percentage > 0.3) return "󰂈"
    if (percentage > 0.2) return "󰂇"
    if (percentage > 0.1) return "󰂆"
    return "󰢜"
  }
  if (percentage > 0.9) return "󰁹"
  if (percentage > 0.8) return "󰂂"
  if (percentage > 0.7) return "󰂁"
  if (percentage > 0.6) return "󰂀"
  if (percentage > 0.5) return "󰁿"
  if (percentage > 0.4) return "󰁾"
  if (percentage > 0.3) return "󰁽"
  if (percentage > 0.2) return "󰁼"
  if (percentage > 0.1) return "󰁻"
  return "󰁺"
}

export default function BatteryModule() {
  const battery = Battery.get_default()
  const percentage = createBinding(battery, "percentage")
  const charging = createBinding(battery, "charging")

  const icon = createComputed(() => batteryIcon(percentage(), charging()))

  const iconClasses = createComputed(() => {
    if (charging()) return ["battery-icon", "charging"]
    if (percentage() <= 0.15) return ["battery-icon", "low"]
    return ["battery-icon"]
  })

  const tooltip = createComputed(() => {
    const p = Math.round(percentage() * 100)
    return charging() ? `${p}% · Charging` : `${p}% · Discharging`
  })

  return (
    <button cssClasses={["battery"]} tooltipText={tooltip}>
      <label cssClasses={iconClasses} label={icon} />
    </button>
  )
}
