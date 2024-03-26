import mongoose, { ObjectId, Schema } from "mongoose";

export type EventType = Event & {
  id?: number;
  isDraggable?: boolean;
  title?: string;
  isAllDay?: boolean | undefined;
  sourceResource?: any;
  color?: string;
  event?: EventTypeWithId;
  employee_id?: string;
  rate?: number
};

type EventTypeWithId = Event & {
  id: number;
};

export interface EventObject {
  start: Date;
  end: Date;
  time: number;
  employee_id: string | Schema.Types.ObjectId;
  title: string;
  color: string;
  restaurant_id: string | Schema.Types.ObjectId;
  _id?: string,
  rate: number
}

const EventSchema = new mongoose.Schema<EventObject>({
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  employee_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "employee",
  },
  title: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  restaurant_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "restaurant"
  },
  rate: {
    type: Number,
    required: true
  }
});

export default mongoose.models.event || mongoose.model<Event>("event", EventSchema);
