import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Event, { EventObject } from "@/models/Event";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const event = await request.json();

    const savedEvent = await Event.create(event)

    return NextResponse.json({
      status: "success",
      event: savedEvent,
      message: "Schedule added",
    });
  } catch (e) {
    return NextResponse.json({
      message:
        "We are experiencing difficulties at the moment. Try again later",
      status: "error",
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const event_id = request.nextUrl.searchParams.get("event_id");
    const events = await Event.findOneAndDelete({_id: event_id}, {new: true});

    return NextResponse.json({
      status: "success",
      events: events,
      message: "Shift canceled",
    });
  } catch (e) {
    return NextResponse.json({
      message:
        "We are experiencing difficulties at the moment. Try again later",
      status: "error",
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const updatedevent = await request.json();

    const event = await Event.findOneAndUpdate({_id: updatedevent._id}, updatedevent, { new: true })

    return NextResponse.json({
      status: "success",
      event,
      message: "Schedule updated",
    });
  } catch (e) {
    return NextResponse.json({
      message:
        "the data was not saved, reload the page (if the error persists, contact the technical department)",
      status: "error",
    });
  }
}

