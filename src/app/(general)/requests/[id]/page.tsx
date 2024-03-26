import { authOptions } from "@/utils/auth";
import { AddRequest } from "@/app/components/Request/AddRequest"
import { RequestDetails } from "@/app/components/Request/RequestDetails"
import { getServerFetch } from "@/lib/serverFetching"
import { EmployeeType } from "@/models/Employee";
import { checkAdminStatus } from "@/utils/helper";
import { getServerSession } from "next-auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Details",
};

export default async function Page({params, searchParams}: {params: { id: string}, searchParams: {edit: string} }) {

    let employeeData
    const requestData = getServerFetch(`/requests/${params.id}/api`, { next: {tags: ['requests']}})
    const sessionData = getServerSession(authOptions);
    const [{data}, session] = await Promise.all([requestData, sessionData])
    
    const isAdmin = checkAdminStatus(session?.role);
  
    if(isAdmin) {
      employeeData = await getServerFetch('/admin/employees/api');
    }
  
    const employeeList = employeeData?.data.map((employee:EmployeeType) => {
      return {_id: employee._id, name: employee.name}
    })
    
    if(searchParams && searchParams.edit && data.adminStatus !== 'pending') return <RequestDetails request={data} isAdmin={isAdmin}/>
 
    if(searchParams && searchParams.edit) return <div className="main-content"><AddRequest request={data} searchParams={searchParams} isAdmin={isAdmin} employeeList={employeeList} /></div>
    return <RequestDetails request={data} isAdmin={isAdmin}/>
} 