import app from "ags/gtk4/app"
import Bar from "./widgets/bar/Bar"
import ControlCenter from "./widgets/controlcenter/ControlCenter"
import Notifications from "./widgets/notifications/Notifications"
import OSD from "./widgets/osd/OSD"
import WifiMenu from "./widgets/wifimenu/WifiMenu"
import BtMenu from "./widgets/btmenu/BtMenu"

app.start({
  css: `${SRC}/style.css`,
  main() {
    app.get_monitors().forEach(Bar)
    ControlCenter()
    Notifications()
    OSD()
    WifiMenu()
    BtMenu()
  },
})
