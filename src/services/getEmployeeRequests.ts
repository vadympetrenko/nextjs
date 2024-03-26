import Employee from "@/models/Employee";
import Request from "@/models/Request";
import { checkAdminStatus } from "@/utils/helper";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export const getEmployeeRequests = async (request: NextRequest) => {
  const page = request.nextUrl.searchParams.get("page") || 1;
  const limit = request.nextUrl.searchParams.get("limit") || 10;
  const skip = (+page - 1) * +limit;

  let requests, totalCount;

  const token = await getToken({
    req: request,
    secret: process?.env?.NEXTAUTH_SECRET,
    cookieName: "next-auth.session-token",
  });
  const isAdmin = checkAdminStatus(token?.role);

  try {
    if (isAdmin) {
      requests = await Request.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(+limit)
        .populate({ path: "employee_id", model: Employee, select: "name" });
      totalCount = await Request.countDocuments();
    } else {
      requests = await Request.find({ employee_id: token!.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(+limit);
      totalCount = await Request.countDocuments({ employee_id: token!.id });
    }

    return { requests, totalCount };
  } catch (e) {
    throw Error("something went wrong in getEmployeeRequests.ts file");
  }
};
