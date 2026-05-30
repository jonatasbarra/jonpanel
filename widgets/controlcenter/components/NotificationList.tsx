import { createBinding, createComputed, For } from "ags"
import { Gtk } from "ags/gtk4"
import Notifd from "gi://AstalNotifd"
import { getDND } from "./QuickToggles"

export default function NotificationList() {
  const notifd = Notifd.get_default()
  const notifications = createBinding(notifd, "notifications")

  const isEmpty = createComputed(() => notifications().length === 0)
  const count = createComputed(() => notifications().length)
  const overflows = createComputed(() => notifications().length > 10)
  const dnd = createComputed(() => getDND())

  return (
    <box cssClasses={["notif-list"]} orientation={Gtk.Orientation.VERTICAL} spacing={6}>
      <box cssClasses={["notif-list-head"]} spacing={6} halign={Gtk.Align.FILL}>
        <label
          cssClasses={["notif-list-title"]}
          label={createComputed(() => `Notifications (${count()})`)}
          hexpand
          xalign={0}
        />
        <button
          cssClasses={["notif-clear"]}
          visible={createComputed(() => !isEmpty())}
          onClicked={() => notifd.clear()}
          label="Clear all"
        />
      </box>

      <box
        cssClasses={["notif-dnd"]}
        orientation={Gtk.Orientation.VERTICAL}
        spacing={6}
        visible={dnd}
        halign={Gtk.Align.CENTER}
      >
        <label cssClasses={["notif-dnd-icon"]} label="󰂛" />
        <label cssClasses={["notif-dnd-label"]} label="Do Not Disturb ativo" />
      </box>

      <box
        cssClasses={["notif-empty"]}
        orientation={Gtk.Orientation.VERTICAL}
        spacing={6}
        halign={Gtk.Align.CENTER}
        visible={createComputed(() => !dnd() && isEmpty())}
      >
        <label cssClasses={["notif-empty-icon"]} label="󰂚" />
        <label cssClasses={["notif-empty-title"]} label="All caught up" />
        <label
          cssClasses={["notif-empty-label"]}
          label="New notifications will appear here."
          wrap
          justify={Gtk.Justification.CENTER}
          xalign={0.5}
        />
      </box>

      <scrolledwindow
        cssClasses={["notif-scroll"]}
        visible={createComputed(() => !dnd() && !isEmpty())}
        vscrollbarPolicy={createComputed(() => (overflows() ? Gtk.PolicyType.AUTOMATIC : Gtk.PolicyType.NEVER))}
        hscrollbarPolicy={Gtk.PolicyType.NEVER}
        propagateNaturalHeight={createComputed(() => !overflows())}
        maxContentHeight={createComputed(() => (overflows() ? 500 : -1))}
        hexpand={true}
      >
        <box orientation={Gtk.Orientation.VERTICAL} spacing={6} hexpand={true}>
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
                  cssClasses={["notif-content"]}
                  orientation={Gtk.Orientation.VERTICAL}
                  spacing={3}
                  hexpand={true}
                >
                  <label
                    cssClasses={["notif-app-name"]}
                    label={notif.appName ?? ""}
                    xalign={0}
                    ellipsize={3}
                    hexpand={true}
                  />
                  <label
                    cssClasses={["notif-summary"]}
                    label={notif.summary ?? ""}
                    xalign={0}
                    wrap
                    wrapMode={0}
                    maxWidthChars={38}
                    hexpand={true}
                  />
                  {notif.body ? (
                    <label
                      cssClasses={["notif-body"]}
                      label={notif.body}
                      xalign={0}
                      wrap
                      wrapMode={0}
                      maxWidthChars={38}
                      hexpand={true}
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
