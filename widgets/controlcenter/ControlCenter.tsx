import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import { closeCC, getCCVisible } from "../../services/controlcenter"
import VolumeSlider from "./components/VolumeSlider"
import BrightnessSlider from "./components/BrightnessSlider"
import QuickToggles from "./components/QuickToggles"
import NotificationList from "./components/NotificationList"
import Header from "./components/Header"

export default function ControlCenter() {
  const { TOP, RIGHT, BOTTOM, LEFT } = Astal.WindowAnchor

  // Backdrop on TOP layer (z=2); CC window on OVERLAY (z=3).
  // Layer ordering in wlr-layer-shell guarantees CC is always above backdrop.
  // Clicking anywhere outside the CC panel hits this transparent surface → closeCC().
  const _backdrop = (
    <window
      name="cc-backdrop"
      cssClasses={["cc-backdrop"]}
      anchor={TOP | RIGHT | BOTTOM | LEFT}
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.NORMAL}
      keymode={Astal.Keymode.NONE}
      visible={getCCVisible}
      application={app}
    >
      <button
        cssClasses={["cc-backdrop-btn"]}
        hexpand
        vexpand
        onClicked={closeCC}
      />
    </window>
  )

  return (
    <window
      name="control-center"
      cssClasses={["control-center"]}
      anchor={TOP}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.NORMAL}
      keymode={Astal.Keymode.ON_DEMAND}
      visible={getCCVisible}
      application={app}
    >
      <box
        orientation={Gtk.Orientation.VERTICAL}
        cssClasses={["cc-container"]}
        widthRequest={380}
      >
        <Header />
        <QuickToggles />
        <VolumeSlider />
        <BrightnessSlider />
        <NotificationList />
      </box>
    </window>
  )
}
