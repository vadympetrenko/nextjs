import {
  CustomCalendar,
  EventObjectExtended,
} from "@/app/components/Employees/CustomCalendar";
import { RestaurantType } from "@/models/Restaurant";
import Link from "next/link";

type DashboardCalendarsType = {
   eventsData: {
    data: EventObjectExtended[],
    restaurant: RestaurantType
   }[]
};

export const DashboardCalendars: React.FC<DashboardCalendarsType> = ({
  eventsData
}) => {
  return (
    <>
      {eventsData.map((item, index) => <div key={item.restaurant._id} >
      <Link className="mb-4 text-center font-bold cursor-pointer block uppercase hover:text-indigo-800 transition-all" href={`/admin/restaurants/${item.restaurant._id}`} >{item.restaurant.name}</Link>
        <CustomCalendar
            key={index}
            events={item.data}
            defaultView="month"
            isAdmin={true}
            views={["month"]}
            restaurant={item.restaurant._id as string}
          />
          </div>
      )}
    </>
  );
};
