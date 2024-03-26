import dbConnect from "@/lib/dbConnect";
import Employee from "@/models/Employee";
import Event from "@/models/Event";
import Restaurant from "@/models/Restaurant";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const _id = request.nextUrl.searchParams.get('_id')
    const start = request.nextUrl.searchParams.get('start');
    const end = request.nextUrl.searchParams.get('end')
    let events

    try {
        await dbConnect()

        if(start && end) {
            events = await Event.find({ restaurant_id: _id, start: {
                $gte: start,
                $lte: end,
              } }).populate({path: 'restaurant_id', model: Restaurant, select: 'name'}).populate({path: 'employee_id', model: Employee, select: 'name rate'}).sort({title: 1})

        } else {
            events = await Event.find({ restaurant_id: _id })
         }

        return NextResponse.json({status: 'success',   data: events, message: "Events has been updated"})
    } catch(e) {
        return NextResponse.json({message: 'We are experiencing difficulties at the moment. Try again later', status: 'error'})
    }
}