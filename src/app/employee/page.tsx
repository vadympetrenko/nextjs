import classes from "@/app/employee/styles.module.scss";
import { getServerFetch } from "@/lib/serverFetching";
import { ReportsTable } from "@/app/components/Report/ReportsTable";
import { AddSection } from "@/app/components/Employees/AddSection";
import { RequestsTable } from "@/app/components/Request/RequestsTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { CustomCalendar } from "@/app/components/Employees/CustomCalendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Page() {
  const startOfWeek = moment().startOf("week").toDate();
  const endOfWeek = moment().endOf("week").toDate();

  const reportsData = getServerFetch("/api/report?limit=5", {next: {revalidate: 0 }});
  const requestData = getServerFetch("/requests/api?limit=5", {next: {revalidate: 0 }});
  const sessionData = getServerSession(authOptions);

  const [{ data }, session, { data: customerReports }] = await Promise.all([
    requestData,
    sessionData,
    reportsData,
  ]);
  const { data: eventsData } = await getServerFetch(
    `/employee/calendar/api?start=${startOfWeek}&end=${endOfWeek}&_id=${session?.id}`
  );

  return (
    <>
      <div className={`${classes.main} main-content`}>
        <h1 className={classes.title}>Hello, {session?.name}</h1>
        <CustomCalendar session={session!} events={eventsData} className={`${classes.calendar} bg-white`} height={400} views={['agenda']}  defaultView="agenda"/>
        <AddSection
          className={`${classes.addReport} ${classes.add}`}
          link={`/reports/add-report`}
          text="Add Report"
        />
        <ReportsTable
          className={classes.reports}
          reportsData={customerReports}
          title="Reports"
        />
        <AddSection
          className={`${classes.add} ${classes.addRequest}`}
          link={`/requests/add-request`}
          text="Add Request For Day Off "
        />
        <RequestsTable
          requestsData={data}
          isAdmin={false}
          session={session!}
          className={classes.requests}
          title="Requests"
        />
      </div>
    </>
  );
}
