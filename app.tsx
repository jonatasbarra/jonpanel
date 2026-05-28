import app from "ags/gtk4/app"
import Bar from "./widgets/bar/Bar"

app.start({
  css: `${SRC}/style.css`,
  main() {
    app.get_monitors().forEach(Bar)
  },
})
