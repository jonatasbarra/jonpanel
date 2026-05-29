import { createState } from "ags"

const [visible, setVisible] = createState(false)

export const getBtMenuVisible = visible
export const toggleBtMenu = () => setVisible(!visible())
export const closeBtMenu = () => setVisible(false)
