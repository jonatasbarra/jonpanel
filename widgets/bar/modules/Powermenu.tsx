import { togglePowerMenu } from "../../../services/powermenu"

export default function Powermenu() {
  return (
    <button
      cssClasses={["powermenu"]}
      tooltipText="Power"
      onClicked={togglePowerMenu}
      label="󰐥"
    />
  )
}
