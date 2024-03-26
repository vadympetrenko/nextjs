import dbConnect from "@/lib/dbConnect";
import Restaurant from "@/models/Restaurant";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await dbConnect()
        const restaurants = await Restaurant.find()
        return NextResponse.json({status: 'success',   data: restaurants })
    } catch(e) {
        return NextResponse.json({message: 'We are experiencing difficulties at the moment. Try again later', status: 'error'})
    }
}