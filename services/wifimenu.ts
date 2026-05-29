import { createState } from "ags"
import Network from "gi://AstalNetwork"

const [visible, setVisible] = createState(false)

export const getWifiMenuVisible = visible
export const closeWifiMenu = () => setVisible(false)

export const toggleWifiMenu = () => {
  const next = !visible()
  setVisible(next)
  if (next) Network.get_default().wifi?.scan()
}
