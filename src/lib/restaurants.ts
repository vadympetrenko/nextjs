import { EventObjectExtended } from "@/app/components/Employees/CustomCalendar";

export function formatEvents (events:EventObjectExtended[]) {
  return events && events.length ? events.map(event => {
      return {
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        };
  }) : []
}