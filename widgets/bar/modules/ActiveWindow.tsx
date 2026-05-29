import { createBinding } from "ags"
import Hyprland from "gi://AstalHyprland"

export default function ActiveWindow() {
  const hyprland = Hyprland.get_default()
  const focusedClient = createBinding(hyprland, "focusedClient")

  const title = focusedClient.as(
    (client: Hyprland.Client | null) => client?.title ?? ""
  )

  return (
    <label
      cssClasses={["active-window"]}
      label={title}
      maxWidthChars={35}
      ellipsize={3}
    />
  )
}
