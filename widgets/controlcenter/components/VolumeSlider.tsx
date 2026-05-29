import { createBinding, createComputed } from "ags"
import { Astal } from "ags/gtk4"
import AstalWp from "gi://AstalWp"

export default function VolumeSlider() {
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

  const percent = createComputed(() => Math.round(volume() * 100))

  const icon = createComputed(() => {
    if (muted()) return "󰖁"
    const p = percent()
    if (p <= 30) return "󰕿"
    if (p <= 70) return "󰖀"
    return "󰕾"
  })

  const labelText = createComputed(() => `${percent()}%`)

  let lastWritten = -1

  function handleChange(self: Astal.Slider) {
    const v = Math.round(self.value)
    if (v === lastWritten) return
    lastWritten = v
    const s = speakerBinding()
    if (s) s.volume = v / 100
  }

  return (
    <box cssClasses={["volume-slider"]} spacing={8}>
      <label cssClasses={["volume-slider-icon"]} label={icon} />
      <slider
        hexpand
        min={0}
        max={100}
        step={1}
        value={percent}
        onNotifyValue={handleChange}
      />
      <label cssClasses={["volume-slider-label"]} label={labelText} />
    </box>
  )
}
