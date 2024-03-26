import mongoose, { Schema } from "mongoose";

export type ReportType = {
  employee_id?: string;
  restaurant?: string;
  mobi2go: number;
  uber: number;
  skip: number;
  giftcard: number;
  allcash: number;
  debit2: number;
  debit1: number;
  gst: number;
  coupons: number;
  product_total: number;
  total_1: number;
  total_2: number;
  subtotal: number;
  grandTotal: number;
  tips?: number;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date
};

export type ReportTypeExtended = ReportType & {
  createdAt: string;
  updatedAt: string;
  _id: string;
  restaurant: {
    name: string;
    _id: string;
  };
  employee_id: {
    name: string;
    _id: string;
  };
};


/* PetSchema will correspond to a collection in your MongoDB database. */
const EmployeeSchema = new mongoose.Schema<ReportType>(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: "employee",
    },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "restaurant",
    },
    mobi2go: {
      type: Number,
      required: true,
    },
    uber: {
      type: Number,
      required: true,
    },
    skip: {
      type: Number,
      required: true,
    },
    giftcard: {
      type: Number,
      required: true,
    },
    allcash: {
      type: Number,
      required: true,
    },
    debit2: {
      type: Number,
      required: true,
    },
    debit1: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number,
      required: true,
    },
    coupons: {
      type: Number,
      required: true,
    },
    product_total: {
      type: Number,
      required: true,
    },
    total_1: {
      type: Number,
      required: true,
    },
    total_2: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    tips: {
      type: Number
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.report ||
  mongoose.model<ReportType>("report", EmployeeSchema);
