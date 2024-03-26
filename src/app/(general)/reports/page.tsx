import { Button } from "@/UI/Button";
import { Toolbar } from "@/UI/Toolbar";
import { ReportsTable } from "@/app/components/Report/ReportsTable";
import { getServerFetch } from "@/lib/serverFetching";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { IoAddSharp } from "react-icons/io5";
import { authOptions } from "@/utils/auth";
import { checkAdminStatus } from "@/utils/helper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Reports",
};

export default async function Page() {
  const reportData = getServerFetch(`/api/report`, {
    next: { tags: ["reports"], revalidate: 1 },
  });
  const sessionData = getServerSession(authOptions);

  const [{ data: report }, session] = await Promise.all([reportData, sessionData]);
  const isAdmin = checkAdminStatus(session?.role);

  const title = isAdmin ? "All Reports" : "Employee Reports";

  return (
    <>
      <Toolbar>
        <Link href={"/reports/add-report"}>
          <Button variation="primary">
            <IoAddSharp />
            Add Report
          </Button>
        </Link>
      </Toolbar>
      <div className="main-content">
        <ReportsTable title={title} reportsData={report} isAdmin={isAdmin} pagination={true} />
      </div>
    </>
  );
}
