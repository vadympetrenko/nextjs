import { AddEmployee } from "@/app/components/Employees/AddEmployee";
import { EmployeeDetails } from "@/app/components/Employees/EmployeeDetails";
import { getServerFetch } from "@/lib/serverFetching";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employee Details",
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { edit: string };
}) {
  const employeeData = getServerFetch(`/admin/employees/${params.id}/api`);
  const restaurantsData = getServerFetch("/api/all-restaurants");

  const [{ data: employee }, { data: restaurants }] = await Promise.all([
    employeeData,
    restaurantsData,
  ]);

  if (searchParams && searchParams.edit)
    return (
      <AddEmployee
        restaurants={restaurants}
        employee={employee}
        searchParams={searchParams}
      />
    );

  return <EmployeeDetails {...employee} />;
}
