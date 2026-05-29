import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { getPowerMenuVisible, closePowerMenu } from "../../services/powermenu"

const ACTIONS = [
  { icon: "󰐥", label: "Shut down",  cmd: "systemctl poweroff" },
  { icon: "󰜉", label: "Restart",    cmd: "systemctl reboot" },
  { icon: "󰤄", label: "Suspend",    cmd: "systemctl suspend" },
  { icon: "󰌾", label: "Lock",       cmd: "loginctl lock-session" },
  { icon: "󰗽", label: "Log out",    cmd: "hyprctl dispatch exit" },
]

function PowerAction({ icon, label, cmd }: { icon: string; label: string; cmd: string }) {
  return (
    <button
      cssClasses={["power-action"]}
      onClicked={() => {
        closePowerMenu()
        execAsync(["bash", "-c", cmd]).catch(console.error)
      }}
    >
      <box orientation={Gtk.Orientation.VERTICAL} spacing={6}>
        <label cssClasses={["power-action-icon"]} label={icon} />
        <label cssClasses={["power-action-label"]} label={label} />
      </box>
    </button>
  )
}

export default function PowerMenu() {
  const { TOP, RIGHT, BOTTOM, LEFT } = Astal.WindowAnchor

  const _backdrop = (
    <window
      name="power-backdrop"
      cssClasses={["power-backdrop"]}
      anchor={TOP | RIGHT | BOTTOM | LEFT}
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.NORMAL}
      keymode={Astal.Keymode.NONE}
      visible={getPowerMenuVisible}
      application={app}
    >
      <button hexpand vexpand onClicked={closePowerMenu} />
    </window>
  )

  return (
    <window
      name="power-menu"
      cssClasses={["power-menu"]}
      anchor={TOP | RIGHT}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.NORMAL}
      keymode={Astal.Keymode.ON_DEMAND}
      visible={getPowerMenuVisible}
      application={app}
    >
      <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
        <label cssClasses={["menu-header"]} label="Power" halign={Gtk.Align.START} />
        <box spacing={8} orientation={Gtk.Orientation.HORIZONTAL}>
          {ACTIONS.map(a => <PowerAction key={a.label} {...a} />)}
        </box>
      </box>
    </window>
  )
}
