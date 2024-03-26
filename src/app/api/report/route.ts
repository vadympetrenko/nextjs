import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getEmployeeReports } from "@/services/getEmployeeReports";

export async function GET(request: NextRequest) {
    const page = request?.nextUrl?.searchParams?.get("page") || 1;
    const limit = request?.nextUrl?.searchParams?.get("limit") || 10;
    const skip = (+page - 1) * +limit;

    try {
        await dbConnect()
        const data = await getEmployeeReports(request)
        return NextResponse.json({status: 'success', data})
    } catch(e) {
        return NextResponse.json({error:e, request:request, message: 'We are experiencing difficulties at the moment. Try again later', status: 'error'})
    }
}