import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import { createBinding, createComputed } from "ags"
import Bluetooth from "gi://AstalBluetooth"
import { getBtMenuVisible, closeBtMenu } from "../../services/btmenu"

function DeviceRow({ device }: { device: Bluetooth.Device }) {
  const connected = createBinding(device, "connected")
  const connecting = createBinding(device, "connecting")

  const statusLabel = createComputed(() => {
    if (connecting()) return "󱥙"
    if (connected()) return "󰗠"
    return ""
  })

  const cssClasses = connected.as((c: boolean) =>
    c ? ["bt-device-row", "active"] : ["bt-device-row"]
  )

  return (
    <button
      cssClasses={cssClasses}
      onClicked={() => {
        if (connected.peek()) device.disconnect_device()
        else device.connect_device()
        closeBtMenu()
      }}
    >
      <box spacing={10}>
        <label cssClasses={["device-icon"]} label="󰂯" />
        <label
          cssClasses={["device-name"]}
          label={device.alias}
          hexpand
          halign={Gtk.Align.START}
        />
        <label cssClasses={["device-status"]} label={statusLabel} />
      </box>
    </button>
  )
}

export default function BtMenu() {
  const { TOP, RIGHT, BOTTOM, LEFT } = Astal.WindowAnchor
  const bluetooth = Bluetooth.get_default()

  const pairedDevices = createBinding(bluetooth, "devices").as(
    (devices: Bluetooth.Device[]) =>
      devices.filter((d) => d.paired)
  )

  const _backdrop = (
    <window
      name="bt-backdrop"
      anchor={TOP | RIGHT | BOTTOM | LEFT}
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.NORMAL}
      keymode={Astal.Keymode.NONE}
      visible={getBtMenuVisible}
      application={app}
    >
      <button hexpand vexpand onClicked={closeBtMenu}>
        <box />
      </button>
    </window>
  )

  return (
    <window
      name="bt-menu"
      cssClasses={["bt-menu"]}
      anchor={TOP | RIGHT}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.NORMAL}
      keymode={Astal.Keymode.ON_DEMAND}
      visible={getBtMenuVisible}
      application={app}
    >
      <box vertical spacing={4}>
        <label cssClasses={["menu-header"]} label="Bluetooth" halign={Gtk.Align.START} />
        <For each={pairedDevices}>
          {(device: Bluetooth.Device) => <DeviceRow device={device} />}
        </For>
      </box>
    </window>
  )
}
