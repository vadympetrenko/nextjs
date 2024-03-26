import dbConnect from "@/lib/dbConnect";
import Employee from "@/models/Employee";
import Request from "@/models/Request";
import { getEmployeeRequests } from "@/services/getEmployeeRequests";
import { NextRequest, NextResponse } from "next/server";
type ReportResponseType = { params: { id: string } };

export async function GET(request: NextRequest, response: ReportResponseType) {
  const _id = response.params.id;

  try {
    await dbConnect();
    let requests = await Request.findOne({ _id }).populate({
      path: "employee_id",
      model: Employee,
      select: "name",
    });

    return NextResponse.json({ status: "success", data: requests });
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
  const _id = response.params.id;
  try {
    await dbConnect();

    await Request.findOneAndDelete({ _id });
    const data = await getEmployeeRequests(request);
    return NextResponse.json({
      status: "success",
      message: "Your request has been successfully deleted",
      data,
    });
  } catch (e) {
    return NextResponse.json({
      message: `Problem connecting to the database, please try again later`,
      status: "error",
    });
  }
}

export async function PUT(request: NextRequest, response: ReportResponseType) {
  const _id = response.params.id;
  let employeeStatus = {};
  try {
    await dbConnect();
    const { status } = await request.json();

    if (status !== "pending") {
      employeeStatus = {
        employeeStatus: "unread",
      };
    }

    await Request.findByIdAndUpdate(
      { _id },
      { adminStatus: status, ...employeeStatus }
    );
    return NextResponse.json({
      status: "success",
      message: "The status of this request has been successfully updated",
    });
  } catch (e) {
    return NextResponse.json({
      message: `Problem connecting to the database, please try again later`,
      status: "error",
    });
  }
}
