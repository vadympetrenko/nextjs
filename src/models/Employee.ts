import {WorkingType } from '@/types/types'
import mongoose from 'mongoose'
import { RestaurantType } from '@/models/Restaurant'

export type EmployeeType = {
  name: string
  phone_number: string
  email: string
  password?: string
  role: string[]
  dob?: string
  rate: number
  working_type: WorkingType 
  store?: string[] | RestaurantType[]
  _id?: string
  color: string
}

export type EmployeeTypeStoreExtended = EmployeeType & {
  store: RestaurantType[]
}

const EmployeeSchema = new mongoose.Schema<EmployeeType>({
  name: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: [String],
    required: true
  },
  dob: {
    type: String,
  },
  color: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  working_type: {
    type: String,
    required: true
  },
  store: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "restaurant"
  }
})

export default mongoose.models.employee || mongoose.model<EmployeeType>('employee', EmployeeSchema)