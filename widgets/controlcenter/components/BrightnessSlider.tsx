import { createComputed } from "ags"
import { createPoll } from "ags/time"
import { execAsync } from "ags/process"
import { Astal } from "ags/gtk4"

export default function BrightnessSlider() {
  const currentRaw = createPoll("0", 500, "brightnessctl g")
  const maxRaw = createPoll("1", 500, "brightnessctl m")

  const percent = createComputed(() => {
    const cur = parseInt(currentRaw()) || 0
    const max = parseInt(maxRaw()) || 1
    return Math.round((cur / max) * 100)
  })

  const icon = createComputed(() => {
    const p = percent()
    if (p <= 30) return "󰃞"
    if (p <= 70) return "󰃟"
    return "󰃠"
  })

  const labelText = createComputed(() => `${percent()}%`)

  // Avoid feedback loop: skip brightnessctl if value matches what we last wrote
  let lastWritten = -1

  function handleChange(self: Astal.Slider) {
    const v = Math.round(self.value)
    if (v === lastWritten) return
    lastWritten = v
    execAsync(["brightnessctl", "s", `${v}%`]).catch(console.error)
  }

  return (
    <box cssClasses={["brightness-slider"]} spacing={8}>
      <label cssClasses={["brightness-icon"]} label={icon} />
      <slider
        hexpand
        min={0}
        max={100}
        step={1}
        value={percent}
        onNotifyValue={handleChange}
      />
      <label cssClasses={["brightness-label"]} label={labelText} />
    </box>
  )
}
