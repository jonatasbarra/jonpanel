import { createComputed } from "ags"
import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import { getOSDType, getOSDValue, getOSDVisible } from "../../services/osd"

export default function OSD() {
  const icon = createComputed(() => {
    const type = getOSDType()
    const v = getOSDValue()
    if (type === "volume") {
      if (v === 0) return "󰖁"
      if (v <= 30) return "󰕿"
      if (v <= 70) return "󰖀"
      return "󰕾"
    }
    if (v <= 30) return "󰃞"
    if (v <= 70) return "󰃟"
    return "󰃠"
  })

  const levelValue = createComputed(() => getOSDValue() / 100)
  const labelText = createComputed(() => `${getOSDValue()}%`)

  return (
    <window
      name="osd"
      cssClasses={["osd-window"]}
      anchor={0}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.NONE}
      visible={getOSDVisible}
      application={app}
    >
      <box
        orientation={Gtk.Orientation.VERTICAL}
        cssClasses={["osd-container"]}
        spacing={8}
        widthRequest={200}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
      >
        <label cssClasses={["osd-icon"]} label={icon} halign={Gtk.Align.CENTER} />
        <levelbar
          cssClasses={["osd-levelbar"]}
          value={levelValue}
          minValue={0}
          maxValue={1}
          hexpand
        />
        <label cssClasses={["osd-label"]} label={labelText} halign={Gtk.Align.CENTER} />
      </box>
    </window>
  )
}
