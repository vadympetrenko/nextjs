import { EventProps } from "react-big-calendar";
import { EventObjectExtended } from "@/app/components/Employees/CustomCalendar";

export const CustomEventView = ({ title, event }: EventProps<EventObjectExtended>) => {
    return (
      <>
        <p>{title}</p>
        <p>Restaurant: {event.restaurant_id.name}</p>
      </>
    );
  };