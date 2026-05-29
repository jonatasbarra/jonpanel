import { createState } from "ags"
import Bluetooth from "gi://AstalBluetooth"

const [visible, setVisible] = createState(false)

export const getBtMenuVisible = visible
export const closeBtMenu = () => {
  setVisible(false)
  Bluetooth.get_default().adapter?.stop_discovery()
}

export const toggleBtMenu = () => {
  const next = !visible()
  setVisible(next)
  const adapter = Bluetooth.get_default().adapter
  if (adapter) {
    if (next) adapter.start_discovery()
    else adapter.stop_discovery()
  }
}
