import { createComputed } from "ags"
import { createPoll } from "ags/time"
import { execAsync } from "ags/process"
import { Astal } from "ags/gtk4"
import { showOSD } from "../../../services/osd"

export default function BrightnessSlider() {
  const currentRaw = createPoll("0", 500, "brightnessctl g")
  const maxRaw = createPoll("1", 500, "brightnessctl m")

  let lastPercent = -1
  const percent = createComputed(() => {
    const cur = parseInt(currentRaw()) || 0
    const max = parseInt(maxRaw()) || 1
    const p = Math.round((cur / max) * 100)
    // Keyboard keys: value changed externally (not via slider drag)
    if (lastPercent !== -1 && p !== lastPercent && p !== lastWritten) {
      console.log("[OSD] brightness poll changed →", p)
      showOSD("brightness", p)
    }
    lastPercent = p
    return p
  })

  const icon = createComputed(() => {
    const p = percent()
    if (p <= 30) return "󰃞"
    if (p <= 70) return "󰃟"
    return "󰃠"
  })

  const labelText = createComputed(() => `${percent()}%`)

  // Tracks last value written by slider to deduplicate OSD triggers from the poll
  let lastWritten = -1

  function handleChange(self: Astal.Slider) {
    const v = Math.round(self.value)
    if (v === lastWritten) return
    lastWritten = v
    execAsync(["brightnessctl", "s", `${v}%`]).catch(console.error)
    showOSD("brightness", v)
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
