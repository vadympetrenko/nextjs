import { CustomCalendar } from "@/app/components/Employees/CustomCalendar";
import { getServerFetch } from "@/lib/serverFetching";
import { authOptions } from "@/utils/auth";
import moment from "moment";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";

export const metadata: Metadata = {
  title: "Calendar",
};

export default async function Page() {
  const startOfWeek = moment().startOf("week").toDate();
  const endOfWeek = moment().endOf("week").toDate();

  const session = await getServerSession(authOptions);
  const { data } = await getServerFetch(
    `/employee/calendar/api?start=${startOfWeek}&end=${endOfWeek}&_id=${session?.id}`
  );

  return (
    <div className="main-content">
      <Suspense fallback={<p>Loading calendar...</p>}>
        <CustomCalendar events={data} session={session!} />
      </Suspense>
    </div>
  );
}
