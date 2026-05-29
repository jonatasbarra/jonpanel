import { createBinding, createComputed } from "ags"
import AstalWp from "gi://AstalWp"
import { showOSD } from "../../../services/osd"

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

  // GObject signal — fires immediately on every WirePlumber property change,
  // bypassing gnim's lazy createComputed. Reconnects if default speaker changes.
  const connectSpeakerOSD = (s: AstalWp.Endpoint) => {
    s.connect("notify::volume", () => {
      console.log("[OSD] volume changed →", s.mute ? 0 : Math.round(s.volume * 100))
      showOSD("volume", s.mute ? 0 : Math.round(s.volume * 100))
    })
    s.connect("notify::mute", () => {
      console.log("[OSD] mute toggled →", s.mute)
      showOSD("volume", s.mute ? 0 : Math.round(s.volume * 100))
    })
  }
  const initialSpeaker = wp.defaultSpeaker
  if (initialSpeaker) connectSpeakerOSD(initialSpeaker)
  wp.connect("notify::default-speaker", () => {
    const s = wp.defaultSpeaker
    if (s) connectSpeakerOSD(s)
  })

  return (
    <box cssClasses={["volume"]} spacing={4}>
      <label cssClasses={["volume-icon"]} label={icon} />
      <label cssClasses={["volume-label"]} label={label} />
    </box>
  )
}
