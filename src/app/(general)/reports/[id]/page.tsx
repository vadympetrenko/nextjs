import { Button } from "@/UI/Button";
import { Toolbar } from "@/UI/Toolbar";
import { AddReport } from "@/app/components/Report/AddReport";
import { Report } from "@/app/components/Report/ReportDetails";
import { getServerFetch } from "@/lib/serverFetching";
import { authOptions } from "@/utils/auth";
import { checkAdminStatus, dateFormat } from "@/utils/helper";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Metadata } from "next";
import moment from "moment";

export const metadata: Metadata = {
  title: "Report Details",
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { edit: string };
}) {
  const isEdit = searchParams.edit;
  const reportData = getServerFetch(`/reports/${params.id}/api`);
  const restaurantsData = getServerFetch("/api/all-restaurants");
  const sessionData = getServerSession(authOptions);

  const [{ data: report }, { data: restaurants }, session] = await Promise.all([
    reportData,
    restaurantsData,
    sessionData,
  ]);

  const isAdmin = checkAdminStatus(session?.role);
  if (isEdit && isAdmin || moment().diff(moment(report.createdAt), "hours") <= 24)
    return (
      <AddReport restaurants={restaurants} report={report} edit={isEdit} />
    );

  return (
    <>
      {isAdmin && (
        <Toolbar>
          <Link href={`/reports/${params.id}?edit=true`}>
            <Button variation="primary">Edit Report</Button>
          </Link>
        </Toolbar>
      )}
      <div className="main-content">
        <h4>
          Report for {dateFormat(report.createdAt)} at {report.restaurant.name}(
          {report?.employee_id?.name || "Admin"})
        </h4>
        {report.createdAt !== report.updatedAt && (
          <h5>updated on {dateFormat(report.updatedAt)} </h5>
        )}
        <Report report={report} />
      </div>
    </>
  );
}
