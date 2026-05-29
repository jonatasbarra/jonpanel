import { createState } from "ags"

const [visible, setVisible] = createState(false)

export const getPowerMenuVisible = visible
export const togglePowerMenu = () => setVisible(!visible())
export const closePowerMenu = () => setVisible(false)
