import { createBinding, createComputed, For } from "ags"
import { Gtk } from "ags/gtk4"
import Notifd from "gi://AstalNotifd"
import { getDND } from "./QuickToggles"

export default function NotificationList() {
  const notifd = Notifd.get_default()
  const notifications = createBinding(notifd, "notifications")

  const isEmpty = createComputed(() => notifications().length === 0)
  const dndActive = createComputed(() => getDND())

  return (
    <box cssClasses={["notif-list"]} orientation={Gtk.Orientation.VERTICAL} spacing={6}>
      {/* DND banner */}
      <box
        cssClasses={["notif-dnd"]}
        orientation={Gtk.Orientation.VERTICAL}
        spacing={6}
        visible={dndActive}
        halign={Gtk.Align.CENTER}
      >
        <label cssClasses={["notif-dnd-icon"]} label="󰂛" />
        <label cssClasses={["notif-dnd-label"]} label="Do Not Disturb ativo" />
      </box>

      {/* Empty state */}
      <box
        cssClasses={["notif-empty"]}
        orientation={Gtk.Orientation.VERTICAL}
        spacing={6}
        halign={Gtk.Align.CENTER}
        visible={createComputed(() => !dndActive() && isEmpty())}
      >
        <label cssClasses={["notif-empty-icon"]} label="󰂚" />
        <label cssClasses={["notif-empty-label"]} label="Sem notificações" />
      </box>

      {/* Notification cards */}
      <scrolledwindow
        cssClasses={["notif-scroll"]}
        visible={createComputed(() => !dndActive() && !isEmpty())}
        vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
        hscrollbarPolicy={Gtk.PolicyType.NEVER}
        maxContentHeight={300}
        hexpand={true}
      >
        <box orientation={Gtk.Orientation.VERTICAL} spacing={6}>
          <For each={notifications}>
            {(notif: Notifd.Notification) => (
              <box cssClasses={["notif-card"]} spacing={10} hexpand={true}>
                {/* App icon */}
                {notif.appIcon
                  ? (
                    <image
                      cssClasses={["notif-app-icon"]}
                      iconName={notif.appIcon}
                      pixelSize={24}
                      valign={Gtk.Align.START}
                    />
                  )
                  : (
                    <label
                      cssClasses={["notif-app-icon", "notif-icon-fallback"]}
                      label="󰂚"
                      valign={Gtk.Align.START}
                    />
                  )
                }

                {/* Content */}
                <box
                  orientation={Gtk.Orientation.VERTICAL}
                  spacing={2}
                  hexpand
                >
                  <label
                    cssClasses={["notif-app-name"]}
                    label={notif.appName ?? ""}
                    xalign={0}
                    ellipsize={3}
                  />
                  <label
                    cssClasses={["notif-summary"]}
                    label={notif.summary ?? ""}
                    xalign={0}
                    ellipsize={3}
                  />
                  {notif.body ? (
                    <label
                      cssClasses={["notif-body"]}
                      label={notif.body}
                      xalign={0}
                      wrap
                      wrapMode={2}
                    />
                  ) : null}
                </box>

                {/* Dismiss */}
                <button
                  cssClasses={["notif-dismiss"]}
                  onClicked={() => notif.dismiss()}
                  valign={Gtk.Align.START}
                >
                  <label label="󰅖" />
                </button>
              </box>
            )}
          </For>
        </box>
      </scrolledwindow>
    </box>
  )
}
