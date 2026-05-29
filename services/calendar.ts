import { createState } from "ags"

const [visible, setVisible] = createState(false)

export const getCalendarVisible = visible
export const toggleCalendar = () => setVisible(!visible())
export const closeCalendar = () => setVisible(false)
