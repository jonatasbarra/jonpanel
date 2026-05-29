import { createState } from "ags"

// Singleton state for Control Center visibility.
// Any widget can import toggleCC() to open/close the panel.
const [ccVisible, setCCVisible] = createState(false)

export const getCCVisible = ccVisible

export function toggleCC() {
  setCCVisible(!ccVisible())
}

export function closeCC() {
  setCCVisible(false)
}
