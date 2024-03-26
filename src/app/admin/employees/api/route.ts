import dbConnect from "@/lib/dbConnect";
import Employee from "@/models/Employee";
import Restaurant from "@/models/Restaurant";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   const execludeRestarauntId =  request.nextUrl.searchParams.get('_id')
    try {
        await dbConnect()

        if(execludeRestarauntId) {
            const employees = await Employee.find({store: { $nin: [execludeRestarauntId] } }).populate({path: 'store', model: Restaurant, select: 'name'})
            return NextResponse.json({data: employees, status: 'success'})
        }

        const employees = await Employee.find().populate({path: 'store', model: Restaurant, select: 'name'})
        if(employees) {
            return NextResponse.json({data: employees, status: 'success'})
        }

        return NextResponse.json({data: employees, status: 'warning'})
          
    } catch (e) {
        return NextResponse.json({"message": `Problem connecting to the database, please try again later`, status: 'error'})
    }
}
