import mongoose, { ObjectId, Schema } from "mongoose";
import { EmployeeType } from "@/models/Employee";

export type RestaurantType = {
    name: string,
    address: string,
    phone_number: string,
    employee_id?: ObjectId[],
    _id?: string
}

export type RestaurantEmployeeType = RestaurantType & {
    employee_id: EmployeeType[],
}

export type RestarauntsTypeWithEmployee = RestaurantType & {
    employee_id: EmployeeIdParams[]
}
  
export type EmployeeIdParams = {
    name:string,
    _id: string,
    color: string, 
    role?: []
}

const StoreSchema = new mongoose.Schema<RestaurantType>({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    employee_id: [{ type: Schema.Types.ObjectId, ref: 'employee' }]
})

export default mongoose.models.restaurant || mongoose.model<RestaurantType>('restaurant', StoreSchema)