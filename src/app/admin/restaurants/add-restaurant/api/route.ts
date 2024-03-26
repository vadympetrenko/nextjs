import dbConnect from "@/lib/dbConnect";
import Restaurant from "@/models/Restaurant";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const restaurant = await request.json();
  try {
    await dbConnect();

    await Restaurant.create(restaurant);

    return NextResponse.json({
      message: `The restaurant successfully added`,
      status: "success",
    });
  } catch (e) {
    return NextResponse.json({
      message: `Problem connecting to the database, please try again later`,
      status: "error",
    });
  }
}

export async function PUT(request: NextRequest) {
  const restaurant = await request.json();

  try {
    await dbConnect();
    await Restaurant.updateOne({ _id: restaurant._id }, restaurant);

    return NextResponse.json({
      message: `The restaurant successfully updated`,
      status: "success",
    });
  } catch (e) {
    return NextResponse.json({
      message: `Problem connecting to the database, please try again later`,
      status: "error",
    });
  }
}
