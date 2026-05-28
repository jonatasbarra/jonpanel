import { createBinding } from "ags"
import Bluetooth from "gi://AstalBluetooth"

export default function BluetoothModule() {
  const bluetooth = Bluetooth.get_default()
  const enabled = createBinding(bluetooth, "isPowered")

  return (
    <label
      cssClasses={enabled.as((e: boolean) =>
        e ? ["bluetooth", "enabled"] : ["bluetooth", "disabled"]
      )}
      label={enabled.as((e: boolean) => (e ? "󰂯" : "󰂲"))}
    />
  )
}
