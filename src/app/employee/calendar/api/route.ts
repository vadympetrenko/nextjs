import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event";
import Restaurant from "@/models/Restaurant";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
    const start = request.nextUrl.searchParams.get('start')
    const end = request.nextUrl.searchParams.get('end')
    const _id = request.nextUrl.searchParams.get('_id')
    
    try {
        await dbConnect()

        const events = await Event.find({employee_id: _id, start : {
            $gte: start,
            $lte: end
        }}).populate({ path: 'restaurant_id', model: Restaurant, select: 'name'})
        
        return NextResponse.json({status: 'success',   data: events, message: events.length ? `Shifts for the selected dates have been loaded` : `Your schedule for these days is empty`})
    } catch(e) {
        return NextResponse.json({message: 'We are experiencing difficulties at the moment. Try again later', status: 'error'})
    }
}