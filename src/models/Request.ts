import { adminStatus, employeeStatus } from "@/types/types";
import mongoose, { ObjectId, Schema } from "mongoose";

export type RequestType = {
  message: string;
  date: string[];
  employee_id: ObjectId | string;
  adminStatus: adminStatus;
  employeeStatus?: "read" | "unread",
  _id?: string,
  createdAt?: Date;
  updatedAt?: Date
};

export type RequestTypeExtended = RequestType & {
  employee_id: {
    name: string, 
    _id: string
  }
};

export const adminStatusArray = Object.entries(adminStatus).map(([key, value]) => {
  return {key, value}
})



export type RequestTypeEmployee = RequestType & {
  employee_id?: {
    name: string,
    _id: ObjectId
  }
}

const RequestSchema = new mongoose.Schema<RequestType>({
  message: {
    type: String,
  },
  date: {
    type: [String],
    required: true,
  },
  employee_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "employee",
  },
  adminStatus: {
    type: String ,
    default:  adminStatus.pending,
    enum: [adminStatus.approved, adminStatus.declined, adminStatus.pending]
  },
  employeeStatus: {
    type: String,
    enum: [employeeStatus.read, employeeStatus.unread],
  }
},
  {
    timestamps: true,
  });


export default mongoose.models.request ||
  mongoose.model<RequestType>("request", RequestSchema);
