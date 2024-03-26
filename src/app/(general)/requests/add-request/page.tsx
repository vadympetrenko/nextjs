import { authOptions } from "@/utils/auth";
import { AddRequest } from "@/app/components/Request/AddRequest";
import { getServerFetch } from "@/lib/serverFetching";
import { EmployeeType } from "@/models/Employee";
import { checkAdminStatus } from "@/utils/helper";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: 'Add Request',
}

export default async function Page() {
  let employeeData

  const session = await getServerSession(authOptions);
  const isAdmin = checkAdminStatus(session?.role);

  if(isAdmin) {
    employeeData = await getServerFetch('/admin/employees/api');
  }

  const employeeList = employeeData?.data.map((employee:EmployeeType) => {
    return {_id: employee._id, name: employee.name}
  })

  return <AddRequest isAdmin={isAdmin} employeeList={employeeList} />
}
