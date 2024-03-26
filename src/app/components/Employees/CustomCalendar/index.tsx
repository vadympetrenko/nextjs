"use client";

import {
  Calendar,
  DateRange,
  View,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import { EventObject } from "@/models/Event";
import { ComponentType, useCallback, useState } from "react";
import { Session } from "next-auth";
import axios from "axios";
import { toast } from "@/hooks/useToast";
import { AgendaTimeComponent } from "@/app/components/Employees/CustomCalendar/AgendaTime";
import { CustomEventView } from "@/app/components/Employees/CustomCalendar/CustomEventView";

export type EventObjectExtended = EventObject & {
  restaurant_id: {
    name: string;
  };
};

type EmployeeCalendarType = {
  events: EventObjectExtended[];
  session?: Session;
  className?: string;
  height?: number,
  views?: View[],
  defaultView?: View,
  isAdmin?: boolean,
  restaurant?: string
};


const localizer = momentLocalizer(moment);


export const CustomCalendar: React.FC<EmployeeCalendarType> = ({
  events,
  session,
  className,
  height = 700,
  views = ['week', 'agenda'],
  defaultView = 'week',
  isAdmin = false,
  restaurant
}) => {
  const [calendarEvents, setCalendarEvents] = useState(formatEvents(events!))
  const eventPropGetter = useCallback((event: EventObject) => {
      return {
        ...(event &&
          event.color && defaultView !== 'agenda' && {
            style: {
              backgroundColor: event.color,
            },
          }),
      };
  }, [defaultView]);
  
  function formatEvents (events:EventObjectExtended[]) {
    return events && events.length ? events.map(event => {
        return {
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          };
    }) : []
  }

  const formats = {
    eventTimeRangeFormat: ({ start, end }: DateRange) => {
      const time = moment.duration(moment(end).diff(moment(start))).asHours();
      return `${moment(start).format("h:mm A")} - ${moment(end).format(
        "h:mm A"
      )} (${time} hours)`;
    },
  };

  const updateRangeAsycn = useCallback(async (start: Date, end:Date) => {
    const url = restaurant ? `/api/events?_id=${restaurant}` : `/employee/calendar/api?_id=${session?.id}`
    const {data} = await axios.get(`${url}&start=${start}&end=${end}`)
    toast(data.message, data.status)
    setCalendarEvents(formatEvents(data.data))
  }, [restaurant, session?.id])


  const handleRangeChange = useCallback( (range: Date[] | {
    start: Date;
    end: Date;
}) => {
    let start, end

    if(Array.isArray(range)) {
      start = moment(range[0]).startOf('day').toDate(), end = moment(range[range.length - 1]).endOf('day').toDate()
    } else {
      start = moment(range.start).startOf('day').toDate(), end = moment(range.end).endOf('day').toDate()
    }

    updateRangeAsycn(start, end)
  }, [updateRangeAsycn]);


  const getDrilldownView = useCallback(() => {
      return null
    },
    []
  )
    
  return (
    <>
    <Calendar
      formats={formats}
      defaultView={defaultView}
      localizer={localizer}
      events={calendarEvents}
      length={31}
      startAccessor="start"
      endAccessor="end"
      views={views}
      popup
      onSelectSlot={() => console.log('data')}
      style={{ height: height }}
      eventPropGetter={eventPropGetter}
      drilldownView="month"
      components={{
        event: isAdmin? ({title}) => (<p>{title}</p>)  : CustomEventView,
        agenda: {
          time: AgendaTimeComponent as ComponentType<{}>
        }
      }}
      className={className}
      getDrilldownView={getDrilldownView}
      onRangeChange={handleRangeChange}
    />
    </>
  );
};
