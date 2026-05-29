import { createState, createComputed, For } from "ags"
import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import Notifd from "gi://AstalNotifd"
import GLib from "gi://GLib"

const MAX_POPUPS = 3
const TIMEOUT_MS = 4000

export default function Notifications() {
  const { TOP, RIGHT } = Astal.WindowAnchor
  const notifd = Notifd.get_default()

  const [popups, setPopups] = createState<Notifd.Notification[]>([])

  function removePopup(id: number) {
    setPopups(popups().filter(n => n.id !== id))
  }

  function addPopup(notif: Notifd.Notification) {
    const prev = popups().filter(n => n.id !== notif.id)
    const next = [...prev, notif]
    setPopups(next.length > MAX_POPUPS ? next.slice(next.length - MAX_POPUPS) : next)

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, TIMEOUT_MS, () => {
      removePopup(notif.id)
      return false
    })
  }

  notifd.connect("notified", (_: unknown, id: number) => {
    const notif = notifd.notifications.find((n: Notifd.Notification) => n.id === id)
    if (notif) addPopup(notif)
  })

  return (
    <window
      name="notifications"
      cssClasses={["notifications-window"]}
      anchor={TOP | RIGHT}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.NORMAL}
      keymode={Astal.Keymode.NONE}
      visible={createComputed(() => popups().length > 0)}
      application={app}
      marginTop={8}
      marginEnd={8}
    >
      <box
        orientation={Gtk.Orientation.VERTICAL}
        cssClasses={["notif-popup-list"]}
        spacing={6}
        widthRequest={360}
      >
        <For each={popups}>
          {(notif: Notifd.Notification) => (
            <box cssClasses={["notif-card", "notif-popup"]} spacing={10} hexpand={true}>
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

              <box orientation={Gtk.Orientation.VERTICAL} spacing={2} hexpand>
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

              <button
                cssClasses={["notif-dismiss"]}
                onClicked={() => {
                  notif.dismiss()
                  removePopup(notif.id)
                }}
                valign={Gtk.Align.START}
              >
                <label label="󰅖" />
              </button>
            </box>
          )}
        </For>
      </box>
    </window>
  )
}
