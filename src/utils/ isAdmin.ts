import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const checkAdminStatus = (array: any) =>
  array.includes("admin") ? true : false;

export const isAdmin = async (request: NextRequest) => {
  const token = await getToken({
    req: request,
    secret: process?.env?.NEXTAUTH_SECRET,
    cookieName: "next-auth.session-token",
  });
  return checkAdminStatus(token?.role);
};
