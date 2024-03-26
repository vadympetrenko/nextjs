import dbConnect from "@/lib/dbConnect";
import Employee, { EmployeeType } from "@/models/Employee";
import Restaurant from "@/models/Restaurant";
import Report from "@/models/Report"
import Event from "@/models/Event";
import { NextRequest, NextResponse } from "next/server";
import revalidateTagAction from "@/app/actions";

export async function GET(request: NextRequest, response:{params: {id: string}}) {
    try {
        await dbConnect()
        const restaurants = await Restaurant.findOne({_id: response.params.id}).populate({path: 'employee_id', model: Employee, select: 'name role color store rate'});
        const employees = await Employee.find({store: { $nin: [response.params.id] }  })
        return NextResponse.json({status: 'success',   data: {restaurants, unassigned: employees}})
    } catch(e) {
        return NextResponse.json({message: 'We are experiencing difficulties at the moment. Try again later', status: 'error'})
    }
}

export async function DELETE(request: Request, response:{params: {id: string}}) {
    try {
        await dbConnect()
        await Restaurant.deleteOne({_id: response.params.id});
        await Event.deleteMany({restaurant_id: response.params.id})
        await Report.deleteMany({restaurant: response.params.id})
        const restaurants = await Restaurant.find()
        return NextResponse.json({status: 'success', data: restaurants, message: "The restaurant was successfully deleted"})
    } catch(e) {
        return NextResponse.json({message: 'We are experiencing difficulties at the moment. Try again later', status: 'error'})
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect()
        const {employees, _id, unassigned}  = await request.json();
        const restaurant = await Restaurant.findOne({_id})
        const ids = employees.map((item:EmployeeType) => item._id)

        ids.map(async (id:number) => {
            await Employee.updateOne({_id: id}, { $addToSet : { store: _id }})
        })
        unassigned.map(async (id: number) => {
            await Employee.updateOne({_id: id}, { $pull: { store: _id }})
        })
        
        restaurant.employee_id = ids
        await restaurant.save()

        const data = await Restaurant.findOne({_id}).populate({path: 'employee_id', model: Employee, select: 'name role'});
        const unassignedNew = await Employee.find({ store: { $exists: false } })
        revalidateTagAction('all-employees')
        return NextResponse.json({status: 'success',   employees: data.employee_id, unassigned: unassignedNew, message: "you have successfully updated employees"})
    } catch(e) {
        return NextResponse.json({message: 'We are experiencing difficulties at the moment. Try again later', status: 'error'})
    }
}
