import dbConnect from "@/lib/dbConnect";
import Employee from "@/models/Employee";
import Request from "@/models/Request";
import { getEmployeeRequests } from "@/services/getEmployeeRequests";
import { checkAdminStatus } from "@/utils/helper";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        await dbConnect()
        const {employee_id, message, employee_name, dates: datesData, adminStatus} = await request.json()
        const date = datesData.map((item: string) => new Date(item))
        const employee = await Employee.findOne({_id: employee_id})
        if(employee) {
            Request.create({employee_id, employee_name, message , date, adminStatus})
            return NextResponse.json({status: 'success', message: 'Your request is submitted'})
        } else {
            return NextResponse.json({status: 'warning', message: 'Please check the name you sent, it looks like there is an error in it, use autocomplete'})
        }
     
    } catch(e) {
         return NextResponse.json({"message": `Problem connecting to the database, please try again later`, status: 'error'})
    }
}

export async function GET(request: NextRequest, response: NextResponse) {
    try {
        await dbConnect()
        const data = await getEmployeeRequests(request);

         return NextResponse.json({status: 'success', data})
    } catch(e) {
         return NextResponse.json({"message": `Problem connecting to the database, please try again later`, status: 'error'})
    }
}

export async function PUT(request: NextRequest, response: NextResponse) {
    try {
        await dbConnect()
        const {employee_id, message, employee_name, dates: datesData, _id, adminStatus} = await request.json()
        const date = datesData.map((item: string) => new Date(item))
        let employeeStatus = {}
        if(adminStatus !== 'pending') {
            employeeStatus = {
                employeeStatus: 'unread'
            } 
        }
        const employee = await Employee.findOne({_id: employee_id})
        if(employee) {
           const requestData = await Request.findOneAndUpdate({_id}, {employee_id, message, employee_name, date, adminStatus, ...employeeStatus})
           requestData.save()
            return NextResponse.json({status: 'success', message: 'Your request is updated'})
        } else {
            return NextResponse.json({status: 'warning', message: 'Please check the name you sent, it looks like there is an error in it, use autocomplete'})
        }
     
    } catch(e) {
         return NextResponse.json({"message": `Problem connecting to the database, please try again later`, status: 'error'})
    }
}