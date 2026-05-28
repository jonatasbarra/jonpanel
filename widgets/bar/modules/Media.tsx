import { createBinding, createComputed } from "ags"
import Mpris from "gi://AstalMpris"

export default function Media() {
  const mpris = Mpris.get_default()
  const players = createBinding(mpris, "players")

  const visible = players.as((ps: Mpris.Player[]) => ps.length > 0)

  // createComputed tracks reactive reads inside — picks up title/artist changes
  const text = createComputed(() => {
    const player = players()[0]
    if (!player) return ""
    const artist = createBinding(player, "artist")() ?? ""
    const title = createBinding(player, "title")() ?? ""
    return artist ? `${artist} — ${title}` : title
  })

  const icon = createComputed(() => {
    const player = players()[0]
    if (!player) return ""
    const status = createBinding(player, "playbackStatus")()
    return status === Mpris.PlaybackStatus.PLAYING ? "󰏤" : "󰐊"
  })

  return (
    <box cssClasses={["media"]} spacing={6} visible={visible}>
      <label cssClasses={["media-icon"]} label={icon} />
      <label
        cssClasses={["media-title"]}
        label={text}
        maxWidthChars={30}
        ellipsize={3}
      />
    </box>
  )
}
