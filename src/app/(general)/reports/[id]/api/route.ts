import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Report from "@/models/Report";
import Restaurant from "@/models/Restaurant";
import Employee from "@/models/Employee";
import { getEmployeeReports } from "@/services/getEmployeeReports";

type ReportResponseType = { params: { id: string } }

export async function GET(request: Request, response: ReportResponseType) {
    try {
        await dbConnect();
        const report = await Report.findOne({_id: response.params.id})
        .populate({ path: "restaurant", model: Restaurant, select: "name" })
        .populate({ path: "employee_id", model: Employee, select: "name" });
        return NextResponse.json({
          data: report,
        });
      } catch (e) {
        return NextResponse.json({
          message: `Problem connecting to the database, please try again later`,
          status: "error",
        });
      }
}

export async function DELETE(
  request: NextRequest,
  response: ReportResponseType
) {
  try {
    await dbConnect();
    await Report.deleteOne({ _id: response.params.id });
    const data = await getEmployeeReports(request)
    return NextResponse.json({
      status: "success",
      message: "Report is removed",
      data,
    });
  } catch (e) {
    return NextResponse.json({
      message: `Problem connecting to the database, please try again later`,
      status: "error",
    });
  }
}
