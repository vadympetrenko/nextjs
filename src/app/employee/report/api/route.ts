import dbConnect from "@/lib/dbConnect"
import { NextResponse } from "next/server"
import Report from "@/models/Report"

export async function POST(request: Request) {
    const data = await request.json()

    try {
        await dbConnect()

        const report = await new Report(data)
        report.save()
        return NextResponse.json({status: 'success', message: 'Your report is submitted'})
    } catch(e){
        return NextResponse.json({"message": `Problem connecting to the database, please try again later`, status: 'error'})
    }
}