import { createBinding, For } from "ags"
import { Gtk } from "ags/gtk4"
import Hyprland from "gi://AstalHyprland"

export default function Workspaces() {
  const hyprland = Hyprland.get_default()
  const workspaces = createBinding(hyprland, "workspaces")
  const focusedWorkspace = createBinding(hyprland, "focusedWorkspace")

  const sorted = workspaces.as((wss: Hyprland.Workspace[]) =>
    wss.filter((ws) => ws.id > 0).sort((a, b) => a.id - b.id)
  )

  return (
    <box cssClasses={["workspaces"]} spacing={4}>
      <For each={sorted}>
        {(ws: Hyprland.Workspace) => (
          <button
            cssClasses={["workspace"]}
            onClicked={() => hyprland.dispatch("workspace", `${ws.id}`)}
            tooltipText={`Workspace ${ws.id}`}
          >
            <box
              cssClasses={focusedWorkspace.as((fw: Hyprland.Workspace | null) =>
                fw?.id === ws.id ? ["workspace-dot", "active"] : ["workspace-dot"]
              )}
              halign={Gtk.Align.CENTER}
              valign={Gtk.Align.CENTER}
            />
          </button>
        )}
      </For>
    </box>
  )
}
