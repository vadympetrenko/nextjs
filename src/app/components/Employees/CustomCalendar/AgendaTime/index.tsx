import { EventObject } from "@/models/Event"
import { ComponentType } from "react"

type agendaTimeComponentType = {event:EventObject, day: Date, label: string}

export const AgendaTimeComponent:ComponentType<agendaTimeComponentType> = ({event, label}) => `${label} (${event.time}h)`