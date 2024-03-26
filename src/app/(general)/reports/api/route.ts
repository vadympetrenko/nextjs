import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Report from "@/models/Report";
import Restaurant from "@/models/Restaurant";

export async function POST(request: Request) {
  const data = await request.json();

  try {
    await dbConnect();

    await Report.create(data);
    return NextResponse.json({
      status: "success",
      message: "Your report is submitted",
    });
  } catch (e) {
    return NextResponse.json({
      message: `Problem connecting to the database, please try again later`,
      status: "error",
    });
  }
}

export async function PUT(request: Request) {
  const data = await request.json();

  try {
    await dbConnect();

    await Report.findByIdAndUpdate(data.report_id, data);
    return NextResponse.json({
      status: "success",
      message: "Your report is updated",
    });
  } catch (e) {
    return NextResponse.json({
      message: `Problem connecting to the database, please try again later`,
      status: "error",
    });
  }
}

export async function GET(request: NextRequest) {
  let reports;
  const restaurant_id = request.nextUrl.searchParams.get("restaurant_id");
  const start = request.nextUrl.searchParams.get("start");
  const end = request.nextUrl.searchParams.get("end");
  try {
    await dbConnect();

    if (start && end) {
      reports = await Report.find({
        restaurant: restaurant_id,
        createdAt: {
          $gte: start,
          $lte: end,
        },
      }).populate({ path: "restaurant", model: Restaurant, select: "name" });
    } else {
      reports = await Report.find({ restaurant: restaurant_id }).populate({ path: "restaurant", model: Restaurant, select: "name" })
    }

    return NextResponse.json({
      status: "success",
      data: reports,
      message: `data for  has been loaded`,
    });
  } catch (e) {
    return NextResponse.json({
      message: `Problem connecting to the database, please try again later`,
      status: "error",
    });
  }
}
