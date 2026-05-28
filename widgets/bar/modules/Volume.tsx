import { createBinding, createComputed } from "ags"
import AstalWp from "gi://AstalWp"

export default function Volume() {
  const wp = AstalWp.get_default()
  const speakerBinding = createBinding(wp, "defaultSpeaker")

  const muted = createComputed(() => {
    const s = speakerBinding()
    if (!s) return false
    return createBinding(s, "mute")()
  })

  const volume = createComputed(() => {
    const s = speakerBinding()
    if (!s) return 0
    return createBinding(s, "volume")()
  })

  const icon = createComputed(() => {
    if (muted()) return "󰖁"
    const v = volume()
    if (v <= 0.3) return "󰕿"
    if (v <= 0.7) return "󰖀"
    return "󰕾"
  })

  const label = createComputed(() => `${Math.round(volume() * 100)}%`)

  return (
    <box cssClasses={["volume"]} spacing={4}>
      <label cssClasses={["volume-icon"]} label={icon} />
      <label cssClasses={["volume-label"]} label={label} />
    </box>
  )
}
