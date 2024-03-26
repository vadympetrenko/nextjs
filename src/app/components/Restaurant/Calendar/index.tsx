"use client";
import React, {
  Fragment,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  Calendar,
  Views,
  momentLocalizer,
  EventProps,
  DateRange,
  SlotInfo,
  View,
} from "react-big-calendar";
import withDragAndDrop, {
  DragFromOutsideItemArgs,
  EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";

import classes from "@/app/components/Restaurant/Calendar/styles.module.scss";
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
import Modal from "@/utils/Modal";
import { useModal } from "@/hooks/useModal";
import DatePicker from "react-datepicker";
import { AiOutlineDelete } from "react-icons/ai";
import { RestaurantEmployeeType } from "@/models/Restaurant";
import { SlCursorMove } from "react-icons/sl";
import { EventObject } from "@/models/Event";
import { EmployeeType } from "@/models/Employee";
import axios from "axios";
import { toast } from "@/hooks/useToast";
import { formatEvents } from "@/lib/restaurants";

const DragAndDropCalendar = withDragAndDrop(Calendar);

export type EventType = {
  title?: string;
  start?: Date;
  end?: Date;
  time?: number;
  color?: string;
  employee_id?: string;
  restaurant_id?: string;
  _id?: string;
  rate?: number
};

type DnDOutsideResourceType = {
  restaurant: RestaurantEmployeeType;
  myEvents: EventObject[];
  setMyEvents: React.Dispatch<React.SetStateAction<EventObject[]>>;
  allEmployees: EmployeeType[];
};
export const DnDOutsideResource: React.FC<DnDOutsideResourceType> = ({
  restaurant,
  myEvents,
  setMyEvents,
  allEmployees
}) => {
  const [isShowing, toggle] = useModal();
  const mLocalizer = momentLocalizer(moment);
  const [draggedEvent, setDraggedEvent] = useState<EventType | null>();
  const [view, setView] = useState<View>(Views.MONTH);
  const [updatedEvent, setUpdatedEvent] = useState<EventType | null>();
  const [date, setDate] = useState(new Date());

  const eventPropGetter = useCallback((event: EventType) => {
    if (event._id === updatedEvent?._id) {
      return {
        className: 'custom-select',
      };
    }

    return {
      ...(event &&
        event.color && {
          style: {
            backgroundColor: event.color,
          },
        }),
    };
  }, [updatedEvent]);

  const handleDragStart = useCallback(
    (event: EventType) => setDraggedEvent(event),
    []
  );

  const sendEvent = useCallback(
    async (event: EventType) => {
      const { data } = await axios.post("/admin/events/api", event);

      toast(data.message, data.status);
      if (data.status === "success") {
        setMyEvents((prevState) => {
          return [...prevState, data.event]
        });
      }
    },
    [setMyEvents]
  );

  const updateEvent = useCallback(
    async (event: EventType) => {
      setMyEvents((prevState) => {
        const newState = prevState.map(prepvEvent => {
          const time = moment
          .duration(moment(event.end).diff(moment(event.start)))
          .asHours();
          if(event._id === prepvEvent._id) {
            return {
              _id: event._id,
              start: new Date(event.start as Date),
              employee_id: event.employee_id as string,
              title: event.title as string,
              color: event.color as string,
              restaurant_id: event.restaurant_id as string,
              end: new Date(event.end as Date),
              rate: event.rate as number,
              time,
            }
          } return prepvEvent
        })
        return newState
      });

      const { data } = await axios.put("/admin/events/api", event);
      toast(data.message, data.status);
    },
    [setMyEvents]
  );

  const moveEvent = useCallback(
    ({ event, start, end }: EventInteractionArgs<EventType>) => {
      updateEvent({ ...event, start: new Date(start), end: new Date(end) });
    },
    [updateEvent]
  );

  const newEvent = useCallback(
    (event: EventType) => {
      setMyEvents((prev) => {
        const time = moment
          .duration(moment(event.end).diff(moment(event.start)))
          .asHours();
        return [
          ...prev,
          {
            _id: event._id,
            start: new Date(event.start as Date),
            employee_id: event.employee_id as string,
            title: event.title as string,
            color: event.color as string,
            restaurant_id: event.restaurant_id as string,
            end: new Date(event.end as Date),
            rate: event.rate as number,
            time,
          },
        ];
      });
    },
    [setMyEvents]
  );

  const onDropFromOutside = useCallback(
    (data: DragFromOutsideItemArgs) => {
      const { title, employee_id, color, restaurant_id, rate } = draggedEvent!;
      const time = moment
        .duration(moment(data.end).diff(moment(data.start)))
        .asHours();
      const event = {
        title: title,
        start: new Date(data.start),
        end: new Date(data.end),
        employee_id: employee_id as string,
        color,
        time,
        rate,
        restaurant_id,
      };
      setDraggedEvent(null);

      sendEvent(event);
    },
    [draggedEvent, sendEvent]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }: EventInteractionArgs<EventType>) => {
      const time = moment.duration(moment(end).diff(moment(start))).asHours();
      const startDate = new Date(start);
      const endDate = new Date(end);
      updateEvent({
        ...event,
        employee_id: event.employee_id as string,
        start: startDate,
        end: endDate,
        time,
      });
    },
    [updateEvent]
  );

  const onNavigate = useCallback(
    (newDate: Date) => setDate(newDate),
    [setDate]
  );

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(0, 0, 0, 23, 0, 0),
    }),
    []
  );
  const onSelectEvent = (
    event: EventType,
    e: React.SyntheticEvent<HTMLElement>
  ) => {
    if ((e.target as Element).closest(".rbc-selected")) toggle();
    setUpdatedEvent(event);
  };

  const onSelectSlotHandler = (data: SlotInfo) => {
    if (view === "month") {
      onNavigate(data.start);
      setView(Views.DAY);
      return;
    }

    const event = {
      start: new Date(data.start),
      end: new Date(data.end),
    };

    newEvent(event);
  };

  const updateDataForEvent = () => {
  const start = new Date(updatedEvent?.start as Date)
  const end = new Date(updatedEvent?.end as Date)
  const time = moment.duration(moment(end).diff(moment(start))).asHours();

    if (updatedEvent?.title && !updatedEvent._id) {
      sendEvent({...updatedEvent, time});
      setMyEvents(prevState => prevState.filter(item => item._id !== updatedEvent._id))
      setUpdatedEvent(null)
    } else if(updatedEvent?._id) {
      updateEvent({...updatedEvent, time});
      setUpdatedEvent(null)
    } else {
      setUpdatedEvent(() => {
        return {start, end}
      })
    }

    toggle();
  };

  const removeEvent = async (
    calendarEvent: EventType,
    event: React.SyntheticEvent<HTMLElement>
  ) => {
    event.stopPropagation();

    if(calendarEvent._id) {
    setMyEvents((prevState) =>  prevState.filter(item => item._id !== calendarEvent._id));

      const { data } = await axios.delete(
        `/admin/events/api?&event_id=${calendarEvent._id}`
      );
  
      toast(data.message, data.status);
  
      if (data.status === "success") {
        setUpdatedEvent(null);
      }
    } else {
      setMyEvents((prevState) =>  prevState.filter(item => String(item.start) !== String(calendarEvent.start)));
    }
  };

  const wrapper = ({ title, event }: EventProps<EventType>) => {
    return (
      <div className={classes.emptyEvent}>
        <button
          onClick={removeEvent.bind(null, event)}
          className={classes.removeEvent}
        >
          <AiOutlineDelete />
        </button>
        {title ? (
          title
        ) : (
          <div className={classes.emptyEmployee}>choose employee</div>
        )}
      </div>
    );
  };

  const onView = useCallback((newView: View) => setView(newView), [setView]);

  const formats = {
    eventTimeRangeFormat: ({ start, end }: DateRange) => {
      const time = moment.duration(moment(end).diff(moment(start))).asHours();
      return `${moment(start).format("h:mm A")} - ${moment(end).format(
        "h:mm A"
      )} (working hours: ${time}h)`;
    },
  };

  const updateRangeAsycn = useCallback(async (start: Date, end:Date) => {
    const url = `/api/events?_id=${restaurant._id}&` 
    const {data} = await axios.get(`${url}&start=${start}&end=${end}`)
    // toast(data.message, data.status)
    setMyEvents(formatEvents(data.data))
  }, [restaurant, setMyEvents])


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

  return (
    <>
      <div
        className={`${classes.calendarWrapper} ${
          view !== "day" ? "full-width" : ""
        }`}
      >
        <DragAndDropCalendar
          date={date}
          formats={formats}
          defaultDate={defaultDate}
          defaultView={view}
          draggableAccessor={() => true}
          eventPropGetter={eventPropGetter}
          events={myEvents.map(event => {
            return {
              ...event,
              start: new Date(event.start),
              end: new Date(event.end)
            }
          })}
          localizer={mLocalizer}
          onDropFromOutside={onDropFromOutside}
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          onSelectSlot={onSelectSlotHandler}
          onSelectEvent={onSelectEvent}
          resizable
          selectable
          scrollToTime={scrollToTime}
          showMultiDayTimes={true}
          step={15}
          min={new Date(0, 0, 0, 10, 0, 0)}
          max={new Date(0, 0, 0, 23, 0, 0)}
          onView={onView}
          views={["week", "day", "month"]}
          view={view}
          components={{
            event: wrapper,
          }}
          onNavigate={onNavigate}
          onRangeChange={handleRangeChange}
        />
      </div>
      <div className="dndOutsideSourceExample">
        {view === "day" && (
          <Fragment key={restaurant._id}>
            <p className={classes.title}>{restaurant.name}</p>
            {(restaurant.employee_id as EmployeeType[]).map((item) => {
              return (
                <div
                  draggable="true"
                  key={item.name}
                  className={classes.employeesList}
                  onDragStart={() =>
                    handleDragStart({
                      title: item.name,
                      employee_id: item._id,
                      color: item.color,
                      restaurant_id: restaurant._id,
                      rate: item.rate
                    })
                  }
                >
                  <SlCursorMove /> {item.name}
                </div>
              );
            })}
            <p className={`${classes.title} mt-12`}>Other employees</p>
            {(allEmployees).map((item) => {
              return (
                <div
                  draggable="true"
                  key={item.name}
                  className={classes.employeesList}
                  onDragStart={() =>
                    handleDragStart({
                      title: item.name,
                      employee_id: item._id,
                      color: item.color,
                      restaurant_id: restaurant._id,
                      rate: item.rate
                    })
                  }
                >
                  <SlCursorMove /> {item.name}
                </div>
              );
            })}
          </Fragment>
        )}
      </div>
      {isShowing && (
        <Modal
          className={classes.eventModal}
          modal={[isShowing, toggle]}
          primaryAction={{
            buttonText: "Update working hours",
            action: updateDataForEvent,
          }}
        >
          <select
            onChange={(e) =>
              setUpdatedEvent((prevState) => ({
                ...prevState,
                employee_id: e.target.value!,
                title: e.target[e.target.selectedIndex].ariaLabel!,
                color: e.target[e.target.selectedIndex].dataset.label,
                restaurant_id: e.target[e.target.selectedIndex].dataset.restaurant_id,
                rate: +e.target[e.target.selectedIndex].dataset.rate!
              }))
            }
          >
            {!updatedEvent?.title && <option value={''} selected> choose employee</option>}
            <Fragment key={restaurant._id}>
              <option disabled>{restaurant.name}</option>
              {(restaurant.employee_id as EmployeeType[]).map((employee) => {
                return (
                  <option
                    key={employee._id}
                    value={employee._id}
                    aria-label={employee.name}
                    data-label={employee.color}
                    data-restaurant_id={restaurant._id}
                    data-rate={employee.rate}
                    selected={updatedEvent?.title === employee.name}
                  >
                    {employee.name}
                  </option>
                );
              })}
              <option disabled>Other employees</option>
              {(allEmployees as EmployeeType[]).map((employee) => {
                return (
                  <option
                    key={employee._id}
                    value={employee._id}
                    aria-label={employee.name}
                    data-label={employee.color}
                    data-restaurant_id={restaurant._id}
                    data-rate={employee.rate}
                    selected={updatedEvent?.title === employee.name}
                  >
                    {employee.name}
                  </option>
                  );
                })}
            </Fragment>
          </select>
          <div>
            <p>start time:</p>
            <DatePicker
              selected={updatedEvent!.start}
              onChange={(date) =>
                setUpdatedEvent((prevState) => ({
                  ...prevState,
                  start: date!,
                }))
              }
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              minTime={new Date(0, 0, 0, 10, 0, 0)}
              maxTime={new Date(0, 0, 0, 22, 30, 0)}
            />
          </div>
          <div>
            <p>end time:</p>
            <DatePicker
              selected={updatedEvent!.end}
              onChange={(date) =>
                setUpdatedEvent((prevState) => ({
                  ...prevState,
                  end: date!,
                }))
              }
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              minTime={new Date(0, 0, 0, 10, 0, 0)}
              maxTime={new Date(0, 0, 0, 22, 30, 0)}
            />
          </div>
        </Modal>
      )}
    </>
  );
};
