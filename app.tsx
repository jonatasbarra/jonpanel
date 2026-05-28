import app from "ags/gtk4/app"
import { Gtk } from "ags/gtk4"

const Hello = () => {
  const win = (
    <window title="JonPanel" application={app}>
      <box cssClasses={["hello"]}>
        <label label="JonPanel — Tokyo Night ✓" />
      </box>
    </window>
  ) as Gtk.Window

  win.present()
  return win
}

app.start({
  css: `${SRC}/style.css`,
  main() {
    Hello()
  },
})
