import mongoose from "mongoose";

export interface Admin {
  name: string;
  email: string;
  password: string;
  role: string[];
}

const AdminSchema = new mongoose.Schema<Admin>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: [String],
    required: true
  }
});

export default mongoose.models.admin || mongoose.model<Admin>("admin", AdminSchema);
