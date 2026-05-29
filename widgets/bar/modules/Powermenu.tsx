import { execAsync } from "ags/process"

// TODO: replace with Rofi powermenu when script is configured
export default function Powermenu() {
  return (
    <button
      cssClasses={["powermenu"]}
      onClicked={() =>
        execAsync(["bash", "-c", "systemctl poweroff"]).catch(console.error)
      }
      label="󰐥"
    />
  )
}
