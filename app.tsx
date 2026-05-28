import app from "ags/gtk4/app"
import Bar from "./widgets/bar/Bar"
import ControlCenter from "./widgets/controlcenter/ControlCenter"

app.start({
  css: `${SRC}/style.css`,
  main() {
    app.get_monitors().forEach(Bar)
    ControlCenter()
  },
})
