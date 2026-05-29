import { createPoll } from "ags/time"
import { toggleCC } from "../../../services/controlcenter"

export default function Clock() {
  const time = createPoll("", 1000, "date +'%H:%M'")
  const date = createPoll("", 60000, "date +'%a %d %b'")

  return (
    <button cssClasses={["clock"]} onClicked={toggleCC}>
      <box spacing={6}>
        <label cssClasses={["clock-date"]} label={date} />
        <label cssClasses={["clock-time"]} label={time} />
      </box>
    </button>
  )
}
