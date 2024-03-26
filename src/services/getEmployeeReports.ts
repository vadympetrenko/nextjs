import Employee from "@/models/Employee";
import Report from "@/models/Report";
import Restaurant from "@/models/Restaurant";
import { checkAdminStatus } from "@/utils/helper";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export const getEmployeeReports = async (request: NextRequest) => {
  const page = request.nextUrl.searchParams.get("page") || 1;
  const limit = request.nextUrl.searchParams.get("limit") || 10;
  const skip = (+page - 1) * +limit;

  let reports, totalCount;

  const token = await getToken({
    req: request,
    secret: process?.env?.NEXTAUTH_SECRET,
    cookieName: "next-auth.session-token",
  });
  const isAdmin = checkAdminStatus(token?.role);

  try {
    if (isAdmin) {
      reports = await Report.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(+limit)
        .populate({ path: "restaurant", model: Restaurant, select: "name" })
        .populate({ path: "employee_id", model: Employee, select: "name" });
      totalCount = await Report.countDocuments();
    } else {
      reports = await Report.find({ employee_id: token?.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(+limit)
        .populate({ path: "restaurant", model: Restaurant, select: "name" })
        .populate({ path: "employee_id", model: Employee, select: "name" });
      totalCount = await Report.countDocuments({ employee_id: token?.id });
    }
    return { reports, totalCount };
  } catch (e) {
    throw Error("something went wrong in getEmployeeReports.ts file");
  }
};
