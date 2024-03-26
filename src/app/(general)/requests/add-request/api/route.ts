import dbConnect from "@/lib/dbConnect";
import Request from "@/models/Request";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, response: NextResponse) {
  try {
    await dbConnect();
    const {_id} = await request.json()

    await Request.updateMany({employee_id: _id, employeeStatus: 'unread'}, {employeeStatus: 'read'})
    return NextResponse.json({
      status: "success",
      message: "Your request is submitted",
    });
  } catch (e) {
    return NextResponse.json({
      message: `Problem connecting to the database, please try again later`,
      status: "error",
    });
  }
}
