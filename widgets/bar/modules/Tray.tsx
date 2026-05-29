import { createBinding, For } from "ags"
import AstalTray from "gi://AstalTray"

export default function Tray() {
  const tray = AstalTray.get_default()
  const items = createBinding(tray, "items")

  return (
    <box cssClasses={["tray"]} spacing={2}>
      <For each={items}>
        {(item: AstalTray.TrayItem) => {
          const gicon = createBinding(item, "gicon")
          return (
            <button
              cssClasses={["tray-item"]}
              onClicked={() => item.activate(0, 0)}
              tooltipText={item.get_title() ?? ""}
            >
              <image gicon={gicon} pixelSize={16} />
            </button>
          )
        }}
      </For>
    </box>
  )
}
