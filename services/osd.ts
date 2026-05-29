import GLib from "gi://GLib"
import { createState } from "ags"

type OSDType = "volume" | "brightness"

const [osdType, setOSDType] = createState<OSDType>("volume")
const [osdValue, setOSDValue] = createState(0)
const [osdVisible, setOSDVisible] = createState(false)

let timeoutId = 0

export const getOSDType = osdType
export const getOSDValue = osdValue
export const getOSDVisible = osdVisible

export function showOSD(type: OSDType, value: number) {
  if (timeoutId > 0) {
    GLib.source_remove(timeoutId)
    timeoutId = 0
  }
  setOSDType(type)
  setOSDValue(value)
  setOSDVisible(true)
  timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 2000, () => {
    setOSDVisible(false)
    timeoutId = 0
    return false
  })
}
