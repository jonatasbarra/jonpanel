import { createBinding, For } from "ags"
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
            cssClasses={focusedWorkspace.as((fw: Hyprland.Workspace | null) =>
              fw?.id === ws.id ? ["workspace", "active"] : ["workspace"]
            )}
            onClicked={() => hyprland.dispatch("workspace", `${ws.id}`)}
            label={ws.id.toString()}
          />
        )}
      </For>
    </box>
  )
}
