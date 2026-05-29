import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import Clock from "./modules/Clock"
import ActiveWindow from "./modules/ActiveWindow"
import Workspaces from "./modules/Workspaces"
import BatteryModule from "./modules/Battery"
import NetworkModule from "./modules/Network"
import BluetoothModule from "./modules/Bluetooth"
import Media from "./modules/Media"
import Volume from "./modules/Volume"
import Tray from "./modules/Tray"
import Powermenu from "./modules/Powermenu"

const Left = () => (
  <box cssClasses={["bar-left"]} halign={Gtk.Align.START} hexpand spacing={8}>
    <Workspaces />
    <ActiveWindow />
  </box>
)

const Center = () => (
  <box cssClasses={["bar-center"]} halign={Gtk.Align.CENTER}>
    <Clock />
  </box>
)

const Right = () => (
  <box cssClasses={["bar-right"]} halign={Gtk.Align.END} hexpand spacing={4}>
    <Tray />
    <Media />
    <BluetoothModule />
    <NetworkModule />
    <BatteryModule />
    <Volume />
    <Powermenu />
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
