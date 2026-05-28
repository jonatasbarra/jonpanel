import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"

// Placeholder modules — will be replaced in Bloco C
const Left = () => (
  <box cssClasses={["bar-left"]} halign={Gtk.Align.START} hexpand>
    <label label="workspaces" />
  </box>
)

const Center = () => (
  <box cssClasses={["bar-center"]} halign={Gtk.Align.CENTER}>
    <label label="active window" />
  </box>
)

const Right = () => (
  <box cssClasses={["bar-right"]} halign={Gtk.Align.END} hexpand>
    <label label="clock · battery · net" />
  </box>
)

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      visible
      name="bar"
      cssClasses={["bar"]}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
      heightRequest={34}
    >
      <centerbox>
        <Left $type="start" />
        <Center $type="center" />
        <Right $type="end" />
      </centerbox>
    </window>
  )
}
