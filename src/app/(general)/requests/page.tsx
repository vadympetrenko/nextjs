import { authOptions } from "@/utils/auth";
import { RequestsTable } from "@/app/components/Request/RequestsTable";
import { getServerFetch } from "@/lib/serverFetching";
import { checkAdminStatus } from "@/utils/helper";
import { getServerSession } from "next-auth";
import { Toolbar } from "@/UI/Toolbar";
import Link from "next/link";
import { Button } from "@/UI/Button";
import { IoAddSharp } from "react-icons/io5";
import { Metadata } from "next";
import revalidateTagAction from "@/app/actions";

export const metadata: Metadata = {
  title: "All Request",
};

export default async function Page() {
  const requestData = getServerFetch("/requests/api", {
    next: { tags: ["requests"], revalidate: 1 },
  });

  const sessionData = getServerSession(authOptions);

  const [{ data }, session] = await Promise.all([requestData, sessionData]);
  const isAdmin = checkAdminStatus(session?.role);
  return (
    <>
      <Toolbar>
        <Link href={"/requests/add-request"}>
          <Button variation="primary">
            <IoAddSharp />
            Add Request
          </Button>
        </Link>
      </Toolbar>
      <div className="main-content">
        <RequestsTable
          requestsData={data}
          isAdmin={isAdmin}
          session={session!}
          pagination={true}
        />
      </div>
    </>
  );
}
