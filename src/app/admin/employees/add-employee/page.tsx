import { AddEmployee } from "@/app/components/Employees/AddEmployee";
import { getServerFetch } from "@/lib/serverFetching";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Employee",
};

export default async function Page() {
  const { data: restaurants } = await getServerFetch("/api/all-restaurants");

  return <AddEmployee restaurants={restaurants} />;
}
