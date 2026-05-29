import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import { getCCVisible } from "../../services/controlcenter"
import VolumeSlider from "./components/VolumeSlider"
import BrightnessSlider from "./components/BrightnessSlider"

export default function ControlCenter() {
  const { TOP, RIGHT } = Astal.WindowAnchor

  return (
    <window
      name="control-center"
      cssClasses={["control-center"]}
      anchor={TOP | RIGHT}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.NORMAL}
      keymode={Astal.Keymode.ON_DEMAND}
      visible={getCCVisible}
      application={app}
    >
      <box
        orientation={Gtk.Orientation.VERTICAL}
        cssClasses={["cc-container"]}
        widthRequest={360}
      >
        <VolumeSlider />
        <BrightnessSlider />
      </box>
    </window>
  )
}
