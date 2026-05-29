import { createBinding } from "ags"
import Bluetooth from "gi://AstalBluetooth"
import { toggleBtMenu } from "../../../services/btmenu"

export default function BluetoothModule() {
  const bluetooth = Bluetooth.get_default()
  const enabled = createBinding(bluetooth, "isPowered")

  const tooltip = createBinding(bluetooth, "devices").as(
    (devices: Bluetooth.Device[]) => {
      const names = devices
        .filter((d) => d.connected)
        .map((d) => d.alias)
        .join(", ")
      return names || (enabled.peek() ? "Bluetooth on" : "Bluetooth off")
    }
  )

  return (
    <button
      cssClasses={enabled.as((e: boolean) =>
        e ? ["bluetooth", "enabled"] : ["bluetooth", "disabled"]
      )}
      tooltipText={tooltip}
      onClicked={toggleBtMenu}
    >
      <label label={enabled.as((e: boolean) => (e ? "󰂯" : "󰂲"))} />
    </button>
  )
}
