import { AllEmployees } from "@/app/components/Employees/AllEmployees";
import { getServerFetch } from "@/lib/serverFetching";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Employees",
};

export default async function Page() {
  const { status, data } = await getServerFetch("/admin/employees/api", {
    next: { tags: ["all-employees"] },
  });
  return <AllEmployees employees={data} status={status} />;
}
