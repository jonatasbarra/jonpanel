import { createPoll } from "ags/time"
import { Gtk, Gdk } from "ags/gtk4"
import { toggleCalendar } from "../../../services/calendar"
import { toggleCC } from "../../../services/controlcenter"

export default function Clock() {
  const time = createPoll("", 1000, "date +'%H:%M'")
  const date = createPoll("", 60000, "date +'%a %d %b'")

  return (
    <button cssClasses={["clock"]} onClicked={toggleCalendar}>
      <Gtk.GestureClick
        button={Gdk.BUTTON_SECONDARY}
        propagationPhase={Gtk.PropagationPhase.CAPTURE}
        onPressed={() => toggleCC()}
      />
      <box spacing={6}>
        <label cssClasses={["clock-date"]} label={date} />
        <label cssClasses={["clock-time"]} label={time} />
      </box>
    </button>
  )
}
