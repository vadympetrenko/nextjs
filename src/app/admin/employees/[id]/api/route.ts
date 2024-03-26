import dbConnect from "@/lib/dbConnect";
import Employee from "@/models/Employee";
import Restaurant from "@/models/Restaurant";
import { NextResponse } from "next/server";

type EmployeeRouteReponseType = {
    params: {id: string}
}

export async function GET(request: Request, response: EmployeeRouteReponseType) {
    try {
        await dbConnect()
        const employee = await Employee.findOne({_id: response.params.id}).populate({path: 'store', model: Restaurant, select: 'name'})
        return NextResponse.json({status: 'success',   data: employee})
    } catch(e) {
        return NextResponse.json({message: 'We are experiencing difficulties at the moment. Try again later', status: 'error'})
    }
}

export async function DELETE(request: Request, response: EmployeeRouteReponseType) {
    try {
        await dbConnect()
        await Employee.deleteOne({_id: response.params.id});
        const employees = await Employee.find()
        return NextResponse.json({status: 'success', employees: employees, message: 'You have successfully deleted the employee'})
    } catch(e) {
        return NextResponse.json({message: 'We are experiencing difficulties at the moment. Try again later', status: 'error'})
    }
}