import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import { getCalendarVisible, closeCalendar } from "../../services/calendar"

export default function CalendarWidget() {
  const { TOP, RIGHT, BOTTOM, LEFT } = Astal.WindowAnchor

  const _backdrop = (
    <window
      name="calendar-backdrop"
      cssClasses={["calendar-backdrop"]}
      anchor={TOP | RIGHT | BOTTOM | LEFT}
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.NORMAL}
      keymode={Astal.Keymode.NONE}
      visible={getCalendarVisible}
      application={app}
    >
      <button hexpand vexpand onClicked={closeCalendar} />
    </window>
  )

  return (
    <window
      name="calendar-popup"
      cssClasses={["calendar-popup"]}
      anchor={TOP}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.NORMAL}
      keymode={Astal.Keymode.ON_DEMAND}
      visible={getCalendarVisible}
      application={app}
    >
      <box orientation={Gtk.Orientation.VERTICAL} spacing={0}>
        <calendar cssClasses={["cal"]} showDayNames showHeading />

        <box cssClasses={["cal-events"]} orientation={Gtk.Orientation.VERTICAL} spacing={6}>
          <label
            cssClasses={["cal-events-header"]}
            label="Events"
            halign={Gtk.Align.START}
          />
          <label
            cssClasses={["cal-events-empty"]}
            label="Google Calendar integration coming soon"
            halign={Gtk.Align.START}
            wrap
          />
        </box>
      </box>
    </window>
  )
}
