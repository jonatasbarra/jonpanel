import { createPoll } from "ags/time"

export default function Clock() {
  // Poll every second — returns formatted time string
  const time = createPoll("", 1000, "date +'%H:%M'")
  const date = createPoll("", 60000, "date +'%a %d %b'")

  return (
    <box cssClasses={["clock"]} spacing={6}>
      <label cssClasses={["clock-date"]} label={date} />
      <label cssClasses={["clock-time"]} label={time} />
    </box>
  )
}
