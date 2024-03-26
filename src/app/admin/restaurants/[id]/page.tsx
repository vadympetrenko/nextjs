import { AddRestaurant } from "@/app/components/Restaurant/AddRestaurant";
import { Restaurant } from "@/app/components/Restaurant";
import { getServerFetch } from "@/lib/serverFetching";
import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";
import { makeChartData, makeTipsData } from "@/utils/helper";
import { Metadata } from "next";
import moment from "moment";
import { REVALIDATE_TIME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Restaurant Details",
};
export const revalidate = REVALIDATE_TIME

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { edit: string };
}) {
  const chartStart = moment().subtract(30, "days").toDate()
  const chartEnd = moment().toDate()
  const eventEnd = moment().endOf('month').toDate()
  const eventStart = moment().subtract(1, 'month').startOf('month').toDate()
  const restaurantData = getServerFetch(`/admin/restaurants/${params.id}/api`);
  const employeesData = getServerFetch(
    `/admin/employees/api?_id=${params.id}`,
    { next: { tags: ["employee"] } }
  );
  const eventsData = getServerFetch(`/api/events?_id=${params.id}&start=${eventStart}&end=${eventEnd}`);
  const reportData = getServerFetch(`/reports/api?restaurant_id=${params.id}&start=${chartStart}&end=${chartEnd}`);

  const [
    { data: restaurant },
    { data: employees },
    { data: events },
    { data: reports },
  ] = await Promise.all([
    restaurantData,
    employeesData,
    eventsData,
    reportData,
  ]);

  const data = makeChartData(reports);
  const tips = makeTipsData(reports)


  const minValue = Math.min(...data.slice(1).map((row: string) => row[1]));
  const maxValue = Math.max(...data.slice(1).map((row: string) => row[1]));
  const difference = maxValue - minValue;

  const options = {
    title: restaurant.restaurants.name,
    isStacked: true,
    height: 400,
    legend: { position: "top", maxLines: 2 },
    vAxis: {
      viewWindow: {
        min: minValue - 0.1 * difference,
        max: maxValue + 0.1 * difference,
      },
    },
  };

  if (searchParams && searchParams.edit)
    return (
      <AddRestaurant
        searchParams={searchParams}
        restaurants={restaurant.restaurants}
      />
    );
  return (
    <Restaurant
      unassigned={restaurant.unassigned}
      restaurants={restaurant.restaurants}
      events={events}
      allEmployees={employees}
      chartData={data}
      chartOptions={options}
      tips={tips}
    />
  );
}
