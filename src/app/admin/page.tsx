import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { getServerFetch } from "@/lib/serverFetching";
import { ReportsTable } from "@/app/components/Report/ReportsTable";
import { RequestsTable } from "@/app/components/Request/RequestsTable";
import { DashboardChart } from "@/app/components/Admin/DashboardChart";
import { DashboardCalendars } from "@/app/components/Admin/DashboardCalendars";
import { RestaurantType } from "@/models/Restaurant";
import moment from 'moment'
import "react-datepicker/dist/react-datepicker.css";
import { allTipsData, allReportsData } from "@/utils/helper";
import { REVALIDATE_TIME } from "@/lib/constants";

export type TransferObjectType = {
  [key: string]: {
    createdAt: string;
    total_1: string;
    total_2: string;
  };
};

export const revalidate = REVALIDATE_TIME

export default async function Page() {
  const chartStart = moment().subtract(30, "days").toDate()
  const chartEnd = moment().toDate()
  const eventEnd = moment().endOf('month').toDate()
  const eventStart = moment().subtract(1, 'month').startOf('month').toDate()

  const { data: allRestaurants } = await getServerFetch("/api/all-restaurants");
  const sessionData = getServerSession(authOptions);
  const requestData = getServerFetch("/requests/api?limit=10", {
    next: { revalidate: 0 },
  });
  const reportsData = getServerFetch("/api/report?limit=10", {
    next: { revalidate: 0 },
  });

  const restaurantsId = allRestaurants.map((restaurant:RestaurantType) => restaurant._id)

  const restaurantsReportData = await Promise.all(restaurantsId.map(
    async (restaurantUrl: string) => {
      return await getServerFetch(
        `/reports/api?restaurant_id=${restaurantUrl}&start=${chartStart}&end=${chartEnd}`
      );
    }
  ))

  const restaurantsEventData = await Promise.all(restaurantsId.map(
    async (restaurantUrl: string) => {
      const response =  await getServerFetch(
        `/api/events?_id=${restaurantUrl}&start=${eventStart}&end=${eventEnd}`
      );
      const restaurantData = await getServerFetch(
        `/admin/restaurants/${restaurantUrl}/api`
      );
      const {data: restaurant} = restaurantData
      const {data} = response

      return {data, restaurant: restaurant.restaurants}
    }
  ))

  const [session, { data: requests }, { data: reports }] = await Promise.all([
    sessionData,
    requestData,
    reportsData,
  ]);

  const chartOptions = {
    title: "Total amount for restaurants",
    isStacked: true,
    height: 400,
    legend: { position: "top", maxLines: 10 },
  };

  const tips =  allTipsData(restaurantsReportData) 
  const chartData = allReportsData(restaurantsReportData)
  
  return (
    <div className={`main-content flex flex-wrap [&>*]:w-[48%] [&>*]:mb-4 justify-between space-x-1`}>
      <DashboardChart chartData={chartData()} options={chartOptions} restaurantsId={restaurantsId} tips={tips()} />
     
      <DashboardCalendars eventsData={restaurantsEventData} />

      <ReportsTable
        reportsData={{
          reports: reports.reports,
          totalCount: reports.totalCount,
        }}
        title={"Last 10 Reports"}
        isAdmin={true}
      />
      <RequestsTable
        title={"Last 10 Requests"}
        requestsData={{
          requests: requests.requests,
          totalCount: requests.totalCount,
        }}
        isAdmin={true}
        session={session!}
      />
    </div>
  );
}
