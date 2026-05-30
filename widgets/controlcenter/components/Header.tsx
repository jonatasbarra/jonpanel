import { createBinding, createComputed } from "ags"
import { Gtk } from "ags/gtk4"
import Battery from "gi://AstalBattery"
import Bluetooth from "gi://AstalBluetooth"
import Network from "gi://AstalNetwork"
import { getDND } from "./QuickToggles"

export default function Header() {
  const network = Network.get_default()
  const wifi = network.wifi
  const bluetooth = Bluetooth.get_default()
  const battery = Battery.get_default()

  const wifiEnabled = createBinding(wifi, "enabled")
  const wifiSsid = createBinding(wifi, "ssid")
  const btEnabled = createBinding(bluetooth, "isPowered")
  const batteryPercent = createBinding(battery, "percentage")
  const batteryCharging = createBinding(battery, "charging")
  const wifiText = createComputed(() => {
    if (!wifiEnabled()) return "Wi-Fi off"
    return wifiSsid() ? `Wi-Fi ${wifiSsid()}` : "Wi-Fi on"
  })

  const btText = createComputed(() => (btEnabled() ? "BT on" : "BT off"))

  const batteryText = createComputed(() => {
    const p = Math.round(batteryPercent() * 100)
    return batteryCharging() ? `Battery ${p}% charging` : `Battery ${p}%`
  })

  const dndText = createComputed(() => (getDND() ? "DND on" : "DND off"))

  return (
    <box cssClasses={["cc-header"]} spacing={4} halign={Gtk.Align.CENTER}>
      <box cssClasses={["cc-status-row"]} spacing={6} halign={Gtk.Align.CENTER}>
        <label cssClasses={["cc-status-chip"]} label={wifiText} />
        <label cssClasses={["cc-status-chip"]} label={btText} />
        <label cssClasses={["cc-status-chip"]} label={batteryText} />
        <label cssClasses={["cc-status-chip"]} label={dndText} />
      </box>
    </box>
  )
}
